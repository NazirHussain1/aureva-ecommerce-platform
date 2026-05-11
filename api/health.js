import { createRequire } from "module";
import { createHandler } from "./_lib/serverless.js";

const require = createRequire(import.meta.url);
const Product = require("../backend/models/Product");

const health = async (req, res) => {
  const mongoose = Product.db.base;
  const dbStates = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.status(200).json({
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    database: {
      status: dbStates[mongoose.connection.readyState],
      name: mongoose.connection.name || "N/A",
    },
  });
};

export default createHandler({ GET: health });
