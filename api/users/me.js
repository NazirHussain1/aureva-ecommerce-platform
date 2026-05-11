import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getMe } = require("../../backend/controllers/authController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler({ GET: [protect, getMe] });
