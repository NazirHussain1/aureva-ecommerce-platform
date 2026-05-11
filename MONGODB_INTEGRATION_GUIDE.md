# MongoDB Integration Guide

Quick reference for implementing MongoDB in the refactored backend.

---

## Step 1: Install Dependencies

```bash
cd backend
npm install mongoose
```

---

## Step 2: Create MongoDB Connection

Create `backend/config/mongodb.js`:

```javascript
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## Step 3: Update server.js

Add MongoDB connection to `backend/server.js`:

```javascript
require("./config/loadEnv");

const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const connectDB = require("./config/mongodb"); // ADD THIS
const logger = require("./utils/logger");
// ... rest of imports

const app = express();

// Connect to MongoDB - ADD THIS
connectDB();

// ... rest of server configuration
```

---

## Step 4: Create Mongoose Models

### Example: User Model

Create `backend/models/User.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  resetPasswordOTP: String,
  resetPasswordOTPExpires: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationOTP: String,
  emailVerificationOTPExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Example: Product Model

Create `backend/models/Product.js`:

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  gender: {
    type: String,
    enum: ['MEN', 'WOMEN', 'UNISEX'],
    default: 'UNISEX'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1, isDeleted: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
```

### Example: Order Model

Create `backend/models/Order.js`:

```javascript
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String
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
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
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
  totalAmount: {
    type: Number,
    required: true
  },
  paidAt: Date,
  deliveredAt: Date
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
```

---

## Step 5: Update Controllers

### Example: User Controller Update

Update `backend/controllers/authController.js`:

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
```

---

## Step 6: Update Services

### Example: Analytics Service

Update `backend/services/analyticsService.js`:

```javascript
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

class AnalyticsService {
  static async getSalesReport(startDate, endDate) {
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return {
      salesData,
      summary: {
        totalOrders: salesData.reduce((sum, day) => sum + day.totalOrders, 0),
        totalRevenue: salesData.reduce((sum, day) => sum + day.totalRevenue, 0)
      }
    };
  }

  static async getDashboardSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, totalCustomers, totalProducts] = await Promise.all([
      Order.countDocuments({
        createdAt: { $gte: today },
        orderStatus: { $ne: 'cancelled' }
      }),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true, isDeleted: false })
    ]);

    return {
      todayOrders,
      totalCustomers,
      totalProducts
    };
  }
}

module.exports = AnalyticsService;
```

---

## Step 7: Environment Variables

Update `.env` file:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aureva?retryWrites=true&w=majority

# Or for local MongoDB
# MONGODB_URI=mongodb://localhost:27017/aureva

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## Step 8: Serverless Deployment (Vercel)

### Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

### Add MongoDB Connection Caching for Serverless:

Update `backend/config/mongodb.js`:

```javascript
const mongoose = require('mongoose');
const logger = require('../utils/logger');

let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available
  if (cachedConnection && mongoose.connection.readyState === 1) {
    logger.info('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Serverless optimization
      bufferCommands: false,
    });

    cachedConnection = conn;
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

module.exports = connectDB;
```

---

## Step 9: Testing

### Install Testing Dependencies:

```bash
npm install --save-dev jest supertest mongodb-memory-server
```

### Create Test Setup:

Create `backend/__tests__/setup.js`:

```javascript
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
```

---

## Quick Commands

```bash
# Install dependencies
npm install mongoose

# Start development server
npm run dev

# Deploy to Vercel
vercel --prod

# Run tests (after setup)
npm test
```

---

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string
6. Replace `<password>` with your database user password
7. Add to `.env` as `MONGODB_URI`

---

## Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Deployment](https://vercel.com/docs)
- [Express + MongoDB Tutorial](https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial)

---

**Status**: Ready to implement MongoDB integration following this guide.
