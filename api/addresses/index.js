import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getAddresses, addAddress } = require("../../backend/controllers/addressController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler({ GET: [protect, getAddresses], POST: [protect, addAddress] });
