import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const categoryController = require("../../backend/modules/category/category.controller");
const { protect, admin } = require("../../backend/middleware/authMiddleware");
const { categorySlugValidation, updateCategoryValidation, categoryIdValidation } = require("../../backend/modules/category/category.validation");

export default createHandler(
  {
    GET: [categorySlugValidation, categoryController.getCategoryBySlug.bind(categoryController)],
    PUT: [protect, admin, updateCategoryValidation, categoryController.updateCategory.bind(categoryController)],
    DELETE: [protect, admin, categoryIdValidation, categoryController.deleteCategory.bind(categoryController)],
  },
  { params: (req) => ({ slug: req.query.param, id: req.query.param }) }
);
