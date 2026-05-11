import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { updateProduct, deleteProduct } = require("../../../backend/controllers/adminProductController");
const { protect } = require("../../../backend/middleware/authMiddleware");
const isAdmin = require("../../../backend/middleware/adminMiddleware");

export default createHandler(
  { PUT: [protect, isAdmin, updateProduct], DELETE: [protect, isAdmin, deleteProduct] },
  { params: (req) => ({ id: req.query.id }) }
);
