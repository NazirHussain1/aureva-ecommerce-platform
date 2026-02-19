const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  res.json(users);
};

const updateUserRole = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = req.body.role || user.role;
  await user.save();

  res.json({ message: "User role updated", user });
};

const updateUserStatus = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const allowedStatuses = ["active", "blocked"];
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  user.status = req.body.status;
  await user.save();

  res.json({ message: "User status updated", user });
};

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
  updateUserStatus,
  deleteUser,
};
