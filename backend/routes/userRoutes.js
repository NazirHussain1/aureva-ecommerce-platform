const express = require("express");
const router = express.Router();
const { signup, login, forgotPassword, verifyOTP, resetPassword, getMe, logout, updateProfile, updateAvatar } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/avatar", protect, upload.single("avatar"), updateAvatar);
router.post("/logout", protect, logout);

module.exports = router;
