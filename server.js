require("dotenv").config();
const sequelize = require("./config/db");
const express = require("express");
const cors = require("cors");

require("./models/User");

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
