import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { updateAddress, deleteAddress } = require("../../backend/controllers/addressController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler(
  { PUT: [protect, updateAddress], DELETE: [protect, deleteAddress] },
  { params: (req) => ({ id: req.query.id }) }
);
