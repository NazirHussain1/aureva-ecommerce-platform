require("dotenv").config();
const sequelize = require("./config/db");
const express = require("express");
const cors = require("cors");

require("./models/User");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/products", productRoutes);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AUREVA API Running...");
});
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log("DB Error:", err));

sequelize.sync({ alter: true })
  .then(() => console.log("Tables synced"))
  .catch(err => console.log(err));
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
