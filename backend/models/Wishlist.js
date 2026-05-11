const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
wishlistSchema.index({ user: 1 });

// Transform output to match frontend expectations
wishlistSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    
    // Transform products if populated
    if (ret.products) {
      ret.products = ret.products.map(product => {
        if (product && product._id) {
          product.id = product._id;
          delete product._id;
        }
        return product;
      });
    }
    
    return ret;
  }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
