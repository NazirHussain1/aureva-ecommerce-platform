import { createRequire } from "module";
import { createHandler } from "../../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { updateCoupon, deleteCoupon } = require("../../../backend/controllers/adminCouponController");
const { protect } = require("../../../backend/middleware/authMiddleware");
const isAdmin = require("../../../backend/middleware/adminMiddleware");

export default createHandler(
  { PUT: [protect, isAdmin, updateCoupon], DELETE: [protect, isAdmin, deleteCoupon] },
  { params: (req) => ({ id: req.query.id }) }
);
