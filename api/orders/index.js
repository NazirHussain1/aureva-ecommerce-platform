import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { placeOrder, getUserOrders } = require("../../backend/controllers/orderController");
const { protect } = require("../../backend/middleware/authMiddleware");
const { validateOrder } = require("../../backend/middleware/validationMiddleware");
const { orderLimiter } = require("../../backend/middleware/rateLimitMiddleware");

export default createHandler({
  POST: [protect, orderLimiter, validateOrder, placeOrder],
  GET: [protect, getUserOrders],
});
