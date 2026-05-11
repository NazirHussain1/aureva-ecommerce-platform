import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getAllProducts, createProduct } = require("../../../backend/controllers/adminProductController");
const { protect } = require("../../../backend/middleware/authMiddleware");
const isAdmin = require("../../../backend/middleware/adminMiddleware");

export default createHandler({
  GET: [protect, isAdmin, getAllProducts],
  POST: [protect, isAdmin, createProduct],
});
