const PaymentService = require('../services/paymentService');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');

// Get active merchant accounts for payment
const getMerchantAccounts = async (req, res) => {
  try {
    const accounts = await PaymentService.getActiveMerchantAccounts();
    res.json({ accounts });
  } catch (error) {
    console.error('Get merchant accounts error:', error);
    res.status(500).json({ message: 'Failed to fetch merchant accounts' });
  }
};

// Create payment for order
const createPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const paymentData = req.body;

    const result = await PaymentService.createPayment(orderId, req.user.id, paymentData);

    res.status(201).json({
      message: 'Payment created successfully',
      payment: result.payment,
      merchantAccount: result.merchantAccount
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: error.message || 'Failed to create payment' });
  }
};

// Get payment by order ID
const getPaymentByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await PaymentService.getPaymentByOrderId(orderId, req.user.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Failed to fetch payment' });
  }
};

// Get user's payment history
const getUserPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filter = { UserId: req.user.id };
    if (status) {
      filter.status = status;
    }

    const offset = (page - 1) * limit;
    
    const { count, rows: payments } = await Payment.findAndCountAll({
      where: filter,
      include: [
        {
          model: Order,
          attributes: ['id', 'totalAmount', 'orderStatus']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPayments: count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

// Upload payment proof
const uploadPaymentProof = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { proofImages } = req.body;

    if (!proofImages || !Array.isArray(proofImages) || proofImages.length === 0) {
      return res.status(400).json({ message: 'Payment proof images are required' });
    }

    const payment = await Payment.findOne({
      where: { id: paymentId, UserId: req.user.id }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await payment.update({
      paymentProof: proofImages,
      status: 'processing'
    });

    res.json({
      message: 'Payment proof uploaded successfully',
      payment
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({ message: 'Failed to upload payment proof' });
  }
};

module.exports = {
  getMerchantAccounts,
  createPayment,
  getPaymentByOrder,
  getUserPayments,
  uploadPaymentProof
};