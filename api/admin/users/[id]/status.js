import { createRequire } from "module";
import { createHandler } from "../../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { updateUserStatus } = require("../../../../backend/controllers/adminUserController");
const { protect } = require("../../../../backend/middleware/authMiddleware");
const isAdmin = require("../../../../backend/middleware/adminMiddleware");

export default createHandler(
  { PUT: [protect, isAdmin, updateUserStatus] },
  { params: (req) => ({ id: req.query.id }) }
);
