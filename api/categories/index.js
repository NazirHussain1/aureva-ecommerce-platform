import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const categoryController = require("../../backend/modules/category/category.controller");
const { protect, admin } = require("../../backend/middleware/authMiddleware");
const { createCategoryValidation } = require("../../backend/modules/category/category.validation");

export default createHandler({ POST: [protect, admin, createCategoryValidation, categoryController.createCategory.bind(categoryController)] });
