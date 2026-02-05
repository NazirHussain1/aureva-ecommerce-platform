const PaymentService = require('../services/paymentService');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const MerchantAccount = require('../models/MerchantAccount');

// Get all payments (Admin)
const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentMethod } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const offset = (page - 1) * limit;
    
    const { count, rows: payments } = await Payment.findAndCountAll({
      where: filter,
      include: [
        {
          model: Order,
          attributes: ['id', 'totalAmount', 'orderStatus']
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: MerchantAccount,
          attributes: ['accountType', 'accountTitle', 'accountNumber']
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
        totalPayments: count
      }
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

// Get pending payments (Admin)
const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { status: 'processing' },
      include: [
        {
          model: Order,
          attributes: ['id', 'totalAmount', 'orderStatus']
        },
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: MerchantAccount,
          attributes: ['accountType', 'accountTitle', 'accountNumber']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json({ payments, count: payments.length });
  } catch (error) {
    console.error('Get pending payments error:', error);
    res.status(500).json({ message: 'Failed to fetch pending payments' });
  }
};

// Verify payment (Admin)
const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, notes } = req.body;

    if (!['completed', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be completed or failed' });
    }

    const payment = await PaymentService.verifyPayment(paymentId, req.user.id, status, notes);

    res.json({
      message: `Payment ${status} successfully`,
      payment
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: error.message || 'Failed to verify payment' });
  }
};

// Refund payment (Admin)
const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Refund reason is required' });
    }

    const payment = await PaymentService.refundPayment(paymentId, req.user.id, reason);

    res.json({
      message: 'Payment refunded successfully',
      payment
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ message: error.message || 'Failed to refund payment' });
  }
};

// Get payment statistics (Admin)
const getPaymentStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
        }
      };
    }

    // Total payments by status
    const paymentsByStatus = await Payment.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'totalAmount']
      ],
      where: dateFilter,
      group: ['status'],
      raw: true
    });

    // Payments by method
    const paymentsByMethod = await Payment.findAll({
      attributes: [
        'paymentMethod',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'totalAmount']
      ],
      where: dateFilter,
      group: ['paymentMethod'],
      raw: true
    });

    // Pending verification count
    const pendingCount = await Payment.count({
      where: { status: 'processing' }
    });

    res.json({
      paymentsByStatus: paymentsByStatus.map(item => ({
        status: item.status,
        count: parseInt(item.count),
        totalAmount: parseFloat(item.totalAmount || 0)
      })),
      paymentsByMethod: paymentsByMethod.map(item => ({
        method: item.paymentMethod,
        count: parseInt(item.count),
        totalAmount: parseFloat(item.totalAmount || 0)
      })),
      pendingVerification: pendingCount
    });
  } catch (error) {
    console.error('Get payment statistics error:', error);
    res.status(500).json({ message: 'Failed to fetch payment statistics' });
  }
};

// Manage merchant accounts (Admin)
const createMerchantAccount = async (req, res) => {
  try {
    const accountData = req.body;

    // If setting as primary, unset other primary accounts of same type
    if (accountData.isPrimary) {
      await MerchantAccount.update(
        { isPrimary: false },
        { where: { accountType: accountData.accountType } }
      );
    }

    const account = await MerchantAccount.create(accountData);

    res.status(201).json({
      message: 'Merchant account created successfully',
      account
    });
  } catch (error) {
    console.error('Create merchant account error:', error);
    res.status(500).json({ message: 'Failed to create merchant account' });
  }
};

const updateMerchantAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const updateData = req.body;

    const account = await MerchantAccount.findByPk(accountId);
    
    if (!account) {
      return res.status(404).json({ message: 'Merchant account not found' });
    }

    // If setting as primary, unset other primary accounts of same type
    if (updateData.isPrimary) {
      await MerchantAccount.update(
        { isPrimary: false },
        { where: { accountType: account.accountType } }
      );
    }

    await account.update(updateData);

    res.json({
      message: 'Merchant account updated successfully',
      account
    });
  } catch (error) {
    console.error('Update merchant account error:', error);
    res.status(500).json({ message: 'Failed to update merchant account' });
  }
};

const deleteMerchantAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await MerchantAccount.findByPk(accountId);
    
    if (!account) {
      return res.status(404).json({ message: 'Merchant account not found' });
    }

    await account.destroy();

    res.json({ message: 'Merchant account deleted successfully' });
  } catch (error) {
    console.error('Delete merchant account error:', error);
    res.status(500).json({ message: 'Failed to delete merchant account' });
  }
};

const getAllMerchantAccounts = async (req, res) => {
  try {
    const accounts = await MerchantAccount.findAll({
      order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({ accounts });
  } catch (error) {
    console.error('Get merchant accounts error:', error);
    res.status(500).json({ message: 'Failed to fetch merchant accounts' });
  }
};

module.exports = {
  getAllPayments,
  getPendingPayments,
  verifyPayment,
  refundPayment,
  getPaymentStatistics,
  createMerchantAccount,
  updateMerchantAccount,
  deleteMerchantAccount,
  getAllMerchantAccounts
};