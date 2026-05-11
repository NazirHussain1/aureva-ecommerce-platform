import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { sendNewsletter } = require("../../../backend/controllers/adminNewsletterController");
const { protect, admin } = require("../../../backend/middleware/authMiddleware");

export default createHandler({ POST: [protect, admin, sendNewsletter] });
