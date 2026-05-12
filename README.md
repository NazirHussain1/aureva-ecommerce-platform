# 🌸 Aureva Beauty E-Commerce Platform

A modern, full-stack e-commerce platform for beauty and cosmetics products built with React, Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Customer Features
- 🛍️ Browse and search products with advanced filtering
- 🛒 Shopping cart management
- ❤️ Wishlist functionality
- ⭐ Product reviews and ratings
- 📦 Order tracking and history
- 👤 User profile management
- 🎫 Coupon and discount system
- 📧 Newsletter subscription
- 💳 Secure payment processing

### Admin Features
- 📊 Comprehensive analytics dashboard
- 📦 Product management (CRUD operations)
- 👥 User management
- 📋 Order management and status updates
- 🏷️ Category management
- 🎟️ Coupon management
- 📈 Sales and revenue reports
- 📬 Contact message management

### Technical Features
- 🔐 JWT-based authentication
- 🔒 Role-based access control (Customer/Admin)
- 📱 Responsive design
- 🚀 RESTful API architecture
- 🗄️ MongoDB database with Mongoose ODM
- ☁️ Cloudinary integration for image storage
- 📧 Email notifications
- 🔄 Real-time updates
- 🛡️ Security best practices (Helmet, rate limiting, input sanitization)

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Icons:** React Icons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize
- **Logging:** Winston

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB)
- **Cloudinary account** (for image storage)
- **Gmail account** (for email notifications)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/aureva.git
cd aureva
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../aureva-frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. **Create `.env` file** in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

2. **Update `.env` with your credentials:**

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aureva?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Aureva Beauty <noreply@aureva.com>
ADMIN_EMAIL=admin@aureva.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Configuration

1. **Create `.env` file** in the `aureva-frontend` directory:

```bash
cd aureva-frontend
cp .env.example .env
```

2. **Update `.env`:**

```env
VITE_API_URL=http://localhost:5000/api
```

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update `MONGODB_URI` in `.env`

### Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Update the Cloudinary credentials in `.env`

### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use the generated password in `EMAIL_PASS`

## 🏃 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd aureva-frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Production Mode

#### Build Frontend

```bash
cd aureva-frontend
npm run build
```

#### Start Backend in Production

```bash
cd backend
NODE_ENV=production npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/signup` | Register new user | No |
| POST | `/users/login` | User login | No |
| GET | `/users/me` | Get current user | Yes |
| PUT | `/users/profile` | Update profile | Yes |
| POST | `/users/forgot-password` | Request password reset | No |
| POST | `/users/verify-otp` | Verify OTP | No |
| POST | `/users/reset-password` | Reset password | No |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get product by ID/slug | No |
| GET | `/products/search` | Search products | No |
| GET | `/products/categories` | Get categories | No |
| GET | `/products/brands` | Get brands | No |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user cart | Yes |
| POST | `/cart` | Add to cart | Yes |
| PUT | `/cart/:id` | Update cart item | Yes |
| DELETE | `/cart/:id` | Remove from cart | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Place order | Yes |
| GET | `/orders` | Get user orders | Yes |
| GET | `/orders/:id` | Get order details | Yes |
| PUT | `/orders/:id/cancel` | Cancel order | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/users` | Get all users | Admin |
| PUT | `/admin/users/:id/role` | Update user role | Admin |
| GET | `/admin/products` | Get all products | Admin |
| POST | `/admin/products` | Create product | Admin |
| PUT | `/admin/products/:id` | Update product | Admin |
| DELETE | `/admin/products/:id` | Delete product | Admin |
| GET | `/admin/orders` | Get all orders | Admin |
| PUT | `/admin/orders/:id/status` | Update order status | Admin |
| GET | `/admin/analytics/dashboard` | Get dashboard stats | Admin |

## 📁 Project Structure

```
aureva/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   ├── package.json     # Backend dependencies
│   └── server.js        # Entry point
│
├── aureva-frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── public/          # Static assets
│   ├── .env             # Environment variables
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
│
└── README.md            # Project documentation
```

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Bcrypt with configurable salt rounds
- **Rate Limiting:** Prevents brute force attacks
- **Input Sanitization:** MongoDB injection prevention
- **XSS Protection:** Cross-site scripting prevention
- **Helmet:** Security headers
- **CORS:** Configured for specific origins
- **Environment Variables:** Sensitive data protection

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd aureva-frontend
npm test
```

## 📝 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | Random 64-char string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_secret` |
| `EMAIL_USER` | Gmail address | `your@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `xxxx xxxx xxxx xxxx` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `12` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up custom domain (optional)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Cloudinary for image hosting
- All contributors and supporters

## 📞 Support

For support, email support@aureva.com or join our Slack channel.

## 🔗 Links

- **Live Demo:** [https://aureva.com](https://aureva.com)
- **Documentation:** [https://docs.aureva.com](https://docs.aureva.com)
- **API Docs:** [https://api.aureva.com/docs](https://api.aureva.com/docs)

---

Made with ❤️ by the Aureva Team
