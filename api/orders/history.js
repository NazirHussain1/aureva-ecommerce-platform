import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getUserOrders } = require("../../backend/controllers/orderController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler({ GET: [protect, getUserOrders] });
