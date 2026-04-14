const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env', '.env.local'];
const loadedKeys = new Set();

if (process.env.NODE_ENV !== 'production') {
  envFiles.forEach((fileName) => {
    const filePath = path.resolve(__dirname, '..', fileName);

    if (!fs.existsSync(filePath)) {
      return;
    }

    const parsed = dotenv.parse(fs.readFileSync(filePath));

    Object.entries(parsed).forEach(([key, value]) => {
      if (process.env[key] === undefined || loadedKeys.has(key)) {
        process.env[key] = value;
        loadedKeys.add(key);
      }
    });
  });
}
