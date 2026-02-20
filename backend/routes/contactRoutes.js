const express = require('express');
const router = express.Router();
const { submitContactForm, getAllMessages, getMessageById, markAsRead, deleteMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitContactForm);
router.get('/', protect, admin, getAllMessages);
router.get('/:id', protect, admin, getMessageById);
router.patch('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
