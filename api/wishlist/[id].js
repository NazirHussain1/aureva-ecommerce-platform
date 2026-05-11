import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { removeFromWishlist } = require("../../backend/controllers/wishlistController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler(
  { DELETE: [protect, removeFromWishlist] },
  { params: (req) => ({ id: req.query.id }) }
);
