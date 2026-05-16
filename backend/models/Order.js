const mongoose = require('mongoose');

const isObjectId = (value) => value instanceof mongoose.Types.ObjectId;
const toId = (value) => String(value?._id || value);

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  image: {
    type: String
  }
}, {
  _id: false
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String },
    phone: { type: String },
    address: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: 'USA' }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'credit_card', 'debit_card', 'paypal', 'stripe', 'razorpay', 'cod', 'cash_on_delivery', 'jazzcash', 'easypaisa', 'bank_transfer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  couponCode: {
    type: String,
    uppercase: true,
    trim: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  trackingNumber: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function() {
  if (!this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
});

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

// Transform output to match frontend expectations
orderSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = toId(ret._id);
    delete ret._id;
    delete ret.__v;
    
    // Transform user if populated
    if (ret.user) {
      if (isObjectId(ret.user)) {
        ret.user = toId(ret.user);
      } else if (ret.user._id) {
        ret.user.id = toId(ret.user._id);
        delete ret.user._id;
      }
    }
    
    // Transform items
    if (ret.items) {
      ret.items = ret.items.map(item => {
        if (item.product) {
          if (isObjectId(item.product)) {
            item.product = toId(item.product);
          } else if (item.product._id) {
            item.product.id = toId(item.product._id);
            delete item.product._id;
          }
        }
        return item;
      });
    }
    
    return ret;
  }
});

module.exports = mongoose.model('Order', orderSchema);
