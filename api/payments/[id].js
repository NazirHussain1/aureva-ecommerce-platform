import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { getPaymentDetails } = require("../../backend/controllers/paymentController");
const { protect } = require("../../backend/middleware/authMiddleware");

export default createHandler(
  { GET: [protect, getPaymentDetails] },
  { params: (req) => ({ id: req.query.id }) }
);
