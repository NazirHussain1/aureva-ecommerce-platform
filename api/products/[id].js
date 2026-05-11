import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const productController = require("../../backend/controllers/productController");
const { protect, admin } = require("../../backend/middleware/authMiddleware");
const { validateProduct } = require("../../backend/middleware/validationMiddleware");

export default createHandler(
  {
    GET: productController.getProductById,
    PUT: [protect, admin, validateProduct, productController.updateProduct],
    DELETE: [protect, admin, productController.deleteProduct],
  },
  { params: (req) => ({ id: req.query.id }) }
);
