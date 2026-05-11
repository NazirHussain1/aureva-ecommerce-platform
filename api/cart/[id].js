import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { updateCartItem, removeCartItem } = require("../../backend/controllers/cartController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler(
  { PUT: [protect, updateCartItem], DELETE: [protect, removeCartItem] },
  { params: (req) => ({ id: req.query.id }) }
);
