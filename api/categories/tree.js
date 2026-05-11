import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const categoryController = require("../../backend/modules/category/category.controller");

export default createHandler({ GET: categoryController.getCategoryTree.bind(categoryController) });
