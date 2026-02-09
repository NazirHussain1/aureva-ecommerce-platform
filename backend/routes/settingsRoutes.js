const express = require('express');
const router = express.Router();
const { getPublicSettings } = require('../controllers/adminSettingsController');

router.get('/', getPublicSettings);

module.exports = router;
