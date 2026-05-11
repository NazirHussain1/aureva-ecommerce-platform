import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getNewsletterStats } = require("../../../backend/controllers/adminNewsletterController");
const { protect, admin } = require("../../../backend/middleware/authMiddleware");

export default createHandler({ GET: [protect, admin, getNewsletterStats] });
