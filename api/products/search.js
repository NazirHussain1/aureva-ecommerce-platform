import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { searchProducts } = require("../../backend/controllers/productController");

export default createHandler({ GET: searchProducts });
