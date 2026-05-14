import { createRequire } from "module";

const require = createRequire(import.meta.url);
const app = require("../backend/app");
const { connectDB } = require("../backend/config/mongodb");

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
