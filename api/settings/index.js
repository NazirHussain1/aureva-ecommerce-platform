import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getPublicSettings } = require("../../backend/controllers/adminSettingsController");

export default createHandler({ GET: getPublicSettings });
