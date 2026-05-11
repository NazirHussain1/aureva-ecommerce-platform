import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { submitContactForm, getAllMessages } = require("../../backend/controllers/contactController");
const { protect, admin } = require("../../backend/middleware/authMiddleware");

export default createHandler({
  POST: submitContactForm,
  GET: [protect, admin, getAllMessages],
});
