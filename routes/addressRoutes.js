const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

module.exports = router;
