import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getWishlist, addToWishlist } = require("../../backend/controllers/wishlistController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler({ GET: [protect, getWishlist], POST: [protect, addToWishlist] });
