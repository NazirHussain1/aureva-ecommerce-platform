import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getNewsletterSubscribers } = require("../../backend/controllers/newsletterController");
const { protect, admin } = require("../../backend/middleware/authMiddleware");

export default createHandler({ GET: [protect, admin, getNewsletterSubscribers] });
