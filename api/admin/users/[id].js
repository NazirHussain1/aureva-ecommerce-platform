import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { updateUserRole, deleteUser } = require("../../../backend/controllers/adminUserController");
const { protect } = require("../../../backend/middleware/authMiddleware");
const isAdmin = require("../../../backend/middleware/adminMiddleware");

export default createHandler(
  { PUT: [protect, isAdmin, updateUserRole], DELETE: [protect, isAdmin, deleteUser] },
  { params: (req) => ({ id: req.query.id }) }
);
