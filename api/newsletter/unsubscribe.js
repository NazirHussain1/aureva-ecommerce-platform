import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { unsubscribeFromNewsletter } = require("../../backend/controllers/newsletterController");

export default createHandler({ POST: unsubscribeFromNewsletter });
