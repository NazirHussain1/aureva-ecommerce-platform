const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Review title cannot exceed 100 characters']
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Indexes for better query performance
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Transform output to match frontend expectations
reviewSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    
    // Transform user if populated
    if (ret.user && ret.user._id) {
      ret.user.id = ret.user._id;
      delete ret.user._id;
    }
    
    // Transform product if populated
    if (ret.product && ret.product._id) {
      ret.product.id = ret.product._id;
      delete ret.product._id;
    }
    
    return ret;
  }
});

module.exports = mongoose.model('Review', reviewSchema);
