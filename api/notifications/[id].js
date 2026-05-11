import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { deleteNotification } = require("../../backend/controllers/notificationController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler(
  { DELETE: [protect, deleteNotification] },
  { params: (req) => ({ id: req.query.id }) }
);
