import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getCart, addToCart } = require("../../backend/controllers/cartController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler({ GET: [protect, getCart], POST: [protect, addToCart] });
