import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { uploadImages } = require("../../backend/controllers/uploadController");
const { protect, admin } = require("../../backend/middleware/authMiddleware");
const upload = require("../../backend/middleware/uploadMiddleware");

export const config = { api: { bodyParser: false } };

export default createHandler({ POST: [protect, admin, upload.array("images", 5), uploadImages] });
