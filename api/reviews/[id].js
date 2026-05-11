import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getProductReviews, createReview, deleteReview } = require("../../backend/controllers/reviewController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler(
  {
    GET: [(req, res, next) => { req.params.productId = req.query.id; next(); }, getProductReviews],
    POST: [protect, (req, res, next) => { req.params.productId = req.query.id; next(); }, createReview],
    DELETE: [protect, deleteReview],
  },
  { params: (req) => ({ id: req.query.id }) }
);
