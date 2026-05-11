const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  reply: {
    type: String,
    trim: true
  },
  repliedAt: {
    type: Date
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ status: 1, createdAt: -1 });

// Transform output to match frontend expectations
contactMessageSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    
    // Transform repliedBy if populated
    if (ret.repliedBy && ret.repliedBy._id) {
      ret.repliedBy.id = ret.repliedBy._id;
      delete ret.repliedBy._id;
    }
    
    return ret;
  }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
