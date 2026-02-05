const express = require("express");
const router = express.Router();
const { signup, login, forgotPassword, resetPassword, getMe, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
