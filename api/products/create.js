import { createRequire } from "module";
import { createHandler } from "../_lib/serverless.js";

const require = createRequire(import.meta.url);
const { createProduct } = require("../../backend/controllers/productController");
const upload = require("../../backend/config/multer");

export const config = { api: { bodyParser: false } };

export default createHandler({ POST: [upload.single("image"), createProduct] });
