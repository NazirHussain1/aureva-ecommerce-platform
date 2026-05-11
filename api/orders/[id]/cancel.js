import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { cancelOrder } = require("../../../backend/controllers/orderController");
const { protect } = require("../../../backend/middleware/authMiddleware");

export default createHandler(
  { PUT: [protect, cancelOrder] },
  { params: (req) => ({ id: req.query.id }) }
);
