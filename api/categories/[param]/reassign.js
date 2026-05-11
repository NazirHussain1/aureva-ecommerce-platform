import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const categoryController = require("../../../backend/modules/category/category.controller");
const { protect, admin } = require("../../../backend/middleware/authMiddleware");
const { categoryIdValidation } = require("../../../backend/modules/category/category.validation");

export default createHandler(
  { POST: [protect, admin, categoryIdValidation, categoryController.reassignProducts.bind(categoryController)] },
  { params: (req) => ({ id: req.query.param }) }
);
