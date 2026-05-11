import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getLowStockProducts } = require("../../../backend/controllers/adminInventoryController");
const { protect } = require("../../../backend/middleware/authMiddleware");
const isAdmin = require("../../../backend/middleware/adminMiddleware");

export default createHandler({ GET: [protect, isAdmin, getLowStockProducts] });
