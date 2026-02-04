const User = require("../models/User");

/* Get all users */
const getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  res.json(users);
};

/* Update user role */
const updateUserRole = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = req.body.role || user.role;
  await user.save();

  res.json({ message: "User role updated", user });
};

/* Delete user */
const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.destroy();
  res.json({ message: "User deleted" });
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};
