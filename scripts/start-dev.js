const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const npmCmd = 'npm';

const services = [
  {
    name: 'backend',
    cwd: path.join(rootDir, 'backend'),
    args: ['start'],
  },
  {
    name: 'frontend',
    cwd: path.join(rootDir, 'aureva-frontend'),
    args: ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
  },
];

const children = [];
let shuttingDown = false;

const pipeOutput = (stream, serviceName, target) => {
  let buffer = '';

  stream.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';

    lines.forEach((line) => {
      if (line.length > 0) {
        target.write(`[${serviceName}] ${line}\n`);
      }
    });
  });

  stream.on('end', () => {
    if (buffer.length > 0) {
      target.write(`[${serviceName}] ${buffer}\n`);
    }
  });
};

const shutdown = (signal = 'SIGTERM') => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  children.forEach((child) => {
    if (!child.killed) {
      child.kill(signal);
    }
  });
};

services.forEach((service) => {
  const child = spawn(npmCmd, service.args, {
    cwd: service.cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });

  pipeOutput(child.stdout, service.name, process.stdout);
  pipeOutput(child.stderr, service.name, process.stderr);

  child.on('exit', (code) => {
    if (shuttingDown) {
      return;
    }

    if (code !== 0) {
      console.error(`[${service.name}] exited with code ${code}`);
      shutdown();
      process.exitCode = code || 1;
    }
  });

  child.on('error', (error) => {
    console.error(`[${service.name}] failed to start: ${error.message}`);
    shutdown();
    process.exitCode = 1;
  });

  children.push(child);
});

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
