import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { protect, admin, getBearerToken } = require("../../backend/middleware/authMiddleware");

export { protect, admin, getBearerToken };
