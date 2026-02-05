const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getPendingPayments,
  verifyPayment,
  refundPayment,
  getPaymentStatistics,
  createMerchantAccount,
  updateMerchantAccount,
  deleteMerchantAccount,
  getAllMerchantAccounts
} = require('../controllers/adminPaymentController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { adminLimiter } = require('../middleware/rateLimitMiddleware');

// All routes require admin access
router.use(protect, adminMiddleware, adminLimiter);

// Payment management routes
router.get('/payments', getAllPayments);
router.get('/payments/pending', getPendingPayments);
router.get('/payments/statistics', getPaymentStatistics);
router.put('/payments/:paymentId/verify', verifyPayment);
router.put('/payments/:paymentId/refund', refundPayment);

// Merchant account management routes
router.get('/merchant-accounts', getAllMerchantAccounts);
router.post('/merchant-accounts', createMerchantAccount);
router.put('/merchant-accounts/:accountId', updateMerchantAccount);
router.delete('/merchant-accounts/:accountId', deleteMerchantAccount);

module.exports = router;