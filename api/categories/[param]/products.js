import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const categoryController = require("../../../backend/modules/category/category.controller");
const { getCategoryProductsValidation } = require("../../../backend/modules/category/category.validation");

export default createHandler(
  { GET: [getCategoryProductsValidation, categoryController.getProductsByCategory.bind(categoryController)] },
  { params: (req) => ({ slug: req.query.param }) }
);
