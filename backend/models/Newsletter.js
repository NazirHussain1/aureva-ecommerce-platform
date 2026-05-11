const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unsubscribedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });

// Transform output to match frontend expectations
newsletterSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
