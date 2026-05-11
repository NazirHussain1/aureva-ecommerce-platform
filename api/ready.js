import { createRequire } from "module";
import { createHandler } from "./_lib/serverless.js";

const require = createRequire(import.meta.url);
const Product = require("../backend/models/Product");

const ready = async (req, res) => {
  const mongoose = Product.db.base;
  const isReady = mongoose.connection.readyState === 1;
  res.status(isReady ? 200 : 503).json({
    status: isReady ? "ready" : "not ready",
    database: isReady ? "connected" : "disconnected",
  });
};

export default createHandler({ GET: ready });
