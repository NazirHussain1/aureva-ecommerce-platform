import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { markAllAsRead } = require("../../backend/controllers/notificationController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler({ PUT: [protect, markAllAsRead] });
