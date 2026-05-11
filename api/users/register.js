import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { signup } = require("../../backend/controllers/authController");

export default createHandler({ POST: signup });
