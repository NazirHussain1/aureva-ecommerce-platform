require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

require("./models/User");
require("./models/Product");
require("./models/Order");
require("./models/OrderItem");
require("./models/Cart");
require("./models/Wishlist");
require("./models/Address");
require("./models/Review");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AUREVA API Running...");
});
app.use(
  "/api/admin/analytics",
  require("./routes/adminAnalyticsRoutes")
);

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/api/admin/products", require("./routes/adminProductRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log("DB Error:", err));

sequelize.sync({ alter: true })
  .then(() => console.log("Tables synced"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
