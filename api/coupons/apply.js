import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { applyCoupon } = require("../../backend/controllers/couponController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler({ POST: [protect, applyCoupon] });
