import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getOrderById } = require("../../backend/controllers/orderController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler(
  { GET: [protect, getOrderById] },
  { params: (req) => ({ id: req.query.id }) }
);
