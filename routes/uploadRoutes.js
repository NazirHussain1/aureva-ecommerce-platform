const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadImages } = require("../controllers/uploadController");

router.post("/", protect, admin, upload.array("images", 5), uploadImages);

module.exports = router;
