import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getProductReviewsBySlug } = require("../../../backend/controllers/reviewController");

export default createHandler(
  { GET: getProductReviewsBySlug },
  { params: (req) => ({ slug: req.query.slug }) }
);
