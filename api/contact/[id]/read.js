import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { markAsRead } = require("../../../backend/controllers/contactController");
const { protect, admin } = require("../../../backend/middleware/authMiddleware");

export default createHandler(
  { PATCH: [protect, admin, markAsRead] },
  { params: (req) => ({ id: req.query.id }) }
);
