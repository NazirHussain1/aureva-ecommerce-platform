import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { resetPassword } = require("../../backend/controllers/authController");

export default createHandler({ POST: resetPassword });
