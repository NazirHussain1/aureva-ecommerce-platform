import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { connectDB } = require("../../backend/config/mongodb");

const isFinished = (res) => res.writableEnded || res.headersSent;

const runMiddleware = (req, res, middleware) =>
  new Promise((resolve, reject) => {
    const next = (error) => (error ? reject(error) : resolve());
    const result = middleware(req, res, next);

    if (result?.then) {
      result.then(() => {
        if (isFinished(res)) resolve();
      }).catch(reject);
      return;
    }

    setImmediate(() => {
      if (isFinished(res)) resolve();
    });
  });

const normalizePipeline = (pipeline) => {
  if (!pipeline) return null;
  return Array.isArray(pipeline) ? pipeline.flat() : [pipeline];
};

export const createHandler = (routes, options = {}) => {
  return async function handler(req, res) {
    try {
      await connectDB();

      if (options.params) {
        req.params = { ...(req.params || {}), ...options.params(req) };
      }

      const method = req.method?.toUpperCase();
      if (method === "OPTIONS") {
        res.setHeader("Allow", Object.keys(routes).join(", "));
        return res.status(204).end();
      }

      const pipeline = normalizePipeline(routes[method]);
      if (!pipeline) {
        res.setHeader("Allow", Object.keys(routes).join(", "));
        return res.status(405).json({ message: "Method not allowed" });
      }

      for (const step of pipeline) {
        await runMiddleware(req, res, step);
        if (isFinished(res)) return;
      }
    } catch (error) {
      if (!isFinished(res)) {
        res.status(500).json({ message: "Server error" });
      }
    }
  };
};
