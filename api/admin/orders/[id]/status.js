import { createRequire } from "module";
import { createHandler } from "../../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { updateOrderStatus } = require("../../../../backend/controllers/adminOrderController");
const { protect } = require("../../../../backend/middleware/authMiddleware");
const isAdmin = require("../../../../backend/middleware/adminMiddleware");

export default createHandler(
  { PUT: [protect, isAdmin, updateOrderStatus] },
  { params: (req) => ({ id: req.query.id }) }
);
