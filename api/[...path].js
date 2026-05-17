const app = require("../backend/app");
const { connectDB } = require("../backend/config/mongodb");

module.exports = async function handler(req, res) {
  await connectDB();

  const routePath = req.query?.path;

  if (routePath) {
    const pathParts = Array.isArray(routePath) ? routePath : [routePath];
    const query = { ...req.query };
    delete query.path;

    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item));
      } else if (value !== undefined) {
        searchParams.set(key, value);
      }
    });

    const search = searchParams.toString();
    req.url = `/api/${pathParts.join("/")}${search ? `?${search}` : ""}`;
  } else if (req.url && !req.url.startsWith("/api/")) {
    req.url = `/api${req.url.startsWith("/") ? req.url : `/${req.url}`}`;
  }

  return app(req, res);
};
