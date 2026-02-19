const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} = require("../controllers/adminUserController");

router.get("/", protect, isAdmin, getAllUsers);
router.put("/:id", protect, isAdmin, updateUserRole);
router.put("/:id/status", protect, isAdmin, updateUserStatus);
router.delete("/:id", protect, isAdmin, deleteUser);

module.exports = router;
