import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const productController = require("../../backend/controllers/productController");
const { protect, admin } = require("../../backend/middleware/authMiddleware");
const { validateProduct } = require("../../backend/middleware/validationMiddleware");
const upload = require("../../backend/config/multer");

export const config = { api: { bodyParser: false } };

export default createHandler({
  GET: productController.getProducts,
  POST: [protect, admin, upload.single("image"), validateProduct, productController.createProduct],
});
