import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getMessageById, deleteMessage } = require("../../backend/controllers/contactController");
const { protect, admin } = require("../../backend/middleware/authMiddleware");

export default createHandler(
  {
    GET: [protect, admin, getMessageById],
    DELETE: [protect, admin, deleteMessage],
  },
  { params: (req) => ({ id: req.query.id }) }
);
