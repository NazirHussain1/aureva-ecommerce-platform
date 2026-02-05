const express = require('express');
const router = express.Router();
const {
  getMerchantAccounts,
  createPayment,
  getPaymentByOrder,
  getUserPayments,
  uploadPaymentProof
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { orderLimiter } = require('../middleware/rateLimitMiddleware');

// All routes require authentication
router.use(protect);

// Get active merchant accounts for payment
router.get('/merchant-accounts', getMerchantAccounts);

// User payment routes
router.post('/order/:orderId', orderLimiter, createPayment);
router.get('/order/:orderId', getPaymentByOrder);
router.get('/history', getUserPayments);
router.put('/:paymentId/proof', uploadPaymentProof);

module.exports = router;