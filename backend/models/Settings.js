const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'email', 'payment', 'shipping', 'seo', 'social', 'other'],
    default: 'general'
  },
  description: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
settingsSchema.index({ key: 1 });
settingsSchema.index({ category: 1 });
settingsSchema.index({ isPublic: 1 });

// Static method to get setting by key
settingsSchema.statics.getSetting = async function(key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set setting
settingsSchema.statics.setSetting = async function(key, value, category = 'general') {
  return await this.findOneAndUpdate(
    { key },
    { value, category },
    { upsert: true, new: true }
  );
};

// Transform output to match frontend expectations
settingsSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
