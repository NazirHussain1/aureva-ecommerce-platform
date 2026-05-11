import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getProductBySlug } = require("../../../backend/controllers/productController");

export default createHandler(
  { GET: getProductBySlug },
  { params: (req) => ({ slug: req.query.slug }) }
);
