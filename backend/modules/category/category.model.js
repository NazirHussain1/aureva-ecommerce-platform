const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  
  // Hierarchy
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: [0, 'Level cannot be negative'],
    max: [2, 'Maximum level is 2']
  },
  
  // SEO Fields
  metaTitle: {
    type: String,
    maxlength: [200, 'Meta title cannot exceed 200 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [500, 'Meta description cannot exceed 500 characters']
  },
  metaKeywords: {
    type: String,
    maxlength: [300, 'Meta keywords cannot exceed 300 characters']
  },
  canonicalUrl: {
    type: String,
    maxlength: [500, 'Canonical URL cannot exceed 500 characters']
  },
  
  // Display & Ordering
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Soft Delete
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },
  deletedAt: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, isDeleted: 1 });
categorySchema.index({ displayOrder: 1 });

// Virtual for children
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Ensure virtuals are included in JSON
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

// Transform output to match frontend expectations
categorySchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    
    // Transform parent if populated
    if (ret.parent && ret.parent._id) {
      ret.parent.id = ret.parent._id;
      delete ret.parent._id;
    }
    
    // Transform children if populated
    if (ret.children) {
      ret.children = ret.children.map(child => {
        if (child._id) {
          child.id = child._id;
          delete child._id;
        }
        return child;
      });
    }
    
    return ret;
  }
});

module.exports = mongoose.model('Category', categorySchema);
