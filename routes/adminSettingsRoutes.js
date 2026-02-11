const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/adminSettingsController');
const { protect } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

router.get('/', protect, isAdmin, getSettings);
router.put('/', protect, isAdmin, updateSettings);

module.exports = router;
