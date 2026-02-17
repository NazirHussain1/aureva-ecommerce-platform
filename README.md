# 🌸 Aureva Beauty - E-Commerce Platform

A full-stack e-commerce platform for beauty and wellness products built with React, Node.js, Express, and MySQL.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse products by 8 categories (Skincare, Haircare, Makeup, Fragrance, Men's Care, Women's Care, Kids' Care, Wellness)
- **Advanced Search** - Search products with real-time filtering
- **Product Details** - Detailed product pages with image galleries
- **Reviews & Ratings** - 5-star rating system with customer reviews
- **Shopping Cart** - Add, update, and remove items
- **Wishlist** - Save favorite products for later
- **User Authentication** - Register, login, forgot/reset password
- **Profile Management** - Update personal information
- **Address Management** - Save multiple shipping addresses
- **Order Management** - View order history and track orders
- **Notifications** - Real-time notification system
- **Newsletter** - Subscribe to promotional emails
- **Responsive Design** - Mobile-friendly interface

### 👨‍💼 Admin Features
- **Dashboard** - Overview of key metrics and statistics
- **Product Management** - Full CRUD operations for products
- **Order Management** - View and update order statuses
- **Customer Management** - View all registered users
- **Coupon Management** - Create and manage discount codes
- **Analytics & Reports** - Sales reports and analytics
- **Inventory Tracking** - Monitor stock levels

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - Image hosting

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd aureva
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run migrate:product-categories
```

Create a `.env` file in the backend directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=aureva
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Create MySQL database:
```sql
CREATE DATABASE aureva;
```

Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd aureva-frontend
npm install
```

Create a `.env` file in the aureva-frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
aureva/
├── backend/
│   ├── config/          # Database and service configurations
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── aureva-frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── app/         # Redux store
│   │   ├── components/  # Reusable components
│   │   ├── features/    # Redux slices
│   │   ├── layouts/     # Layout components
│   │   ├── pages/       # Page components
│   │   └── utils/       # Helper functions
│   └── index.html       # Entry HTML
│
└── README.md
```

## 🎨 Categories

1. **Skincare** - Face care, moisturizers, serums
2. **Haircare** - Shampoos, conditioners, treatments
3. **Makeup** - Cosmetics, foundations, lipsticks
4. **Fragrance** - Perfumes, colognes
5. **Men's Care** - Grooming products for men
6. **Women's Care** - Beauty products for women
7. **Kids' Care** - Safe products for children
8. **Wellness** - Health and wellness items

## 🔐 Default Admin Account

Public registration always creates `customer` users.

Create a dedicated admin user with:

```bash
cd backend
npm run create-admin -- --email admin@example.com --password "StrongPass123!" --name "Store Admin"
```

If the email already exists, the script will not overwrite that account.

## 📱 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Admin
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/users` - Manage users
- `GET /api/admin/coupons` - Manage coupons
- `GET /api/admin/analytics` - View analytics

## 🎯 Key Features Implementation

### Product Reviews
- Users can rate products (1-5 stars)
- Write detailed reviews
- View average ratings
- See all customer reviews

### Notifications
- Real-time notification bell
- Order updates
- Promotional notifications
- Mark as read/unread

### Address Management
- Multiple shipping addresses
- Set default address
- Full CRUD operations

### Coupon System
- Create discount codes
- Set expiry dates
- Minimum purchase requirements
- Percentage-based discounts

## 🛠️ Development

### Run in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd aureva-frontend
npm run dev
```

### Build for Production

Frontend:
```bash
cd aureva-frontend
npm run build
```

## 🧪 Testing

### Backend Testing (Jest & Supertest)

The backend includes comprehensive test coverage using Jest and Supertest.

```bash
# Run all backend tests
cd backend
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test auth.test.js
```

#### Test Coverage
- **Authentication Tests** - 14 test cases
- **Product Tests** - 22 test cases
- **Cart Tests** - 17 test cases
- **Order Tests** - 17 test cases
- **Total**: 70+ comprehensive test cases

#### Documentation
- 📖 **Main Guide**: `backend/TESTING_GUIDE.md`
- 📋 **Quick Start**: `backend/__tests__/QUICK_START.md`
- 📊 **Summary**: `backend/TEST_SUMMARY.md`
- ✅ **Checklist**: `backend/TESTING_CHECKLIST.md`

### Frontend Testing

```bash
# Run frontend tests
cd aureva-frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `DB_SYNC_ALTER` (optional) - Set `true` only for controlled local schema auto-alter
- `JWT_SECRET` - JWT secret key
- `EMAIL_*` - Email service configuration
- `CLOUDINARY_*` - Image hosting configuration
- `ADMIN_EMAIL` (optional) - Default admin email for bootstrap script
- `ADMIN_PASSWORD` (optional) - Default admin password for bootstrap script
- `ADMIN_NAME` (optional) - Default admin display name for bootstrap script

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React Icons for beautiful icons
- Tailwind CSS for styling
- All contributors and supporters

## 📞 Support

For support, email support@aureva.com or open an issue in the repository.

## 🚀 Deployment

### Deploy to Railway

This application is ready to deploy to Railway in ~10 minutes!

**Quick Start**: See [QUICK_RAILWAY_SETUP.md](QUICK_RAILWAY_SETUP.md)

**Complete Guide**: See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

**Checklist**: See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

#### What You'll Need
- Railway account ([railway.app](https://railway.app))
- Cloudinary account for images
- Gmail app password for emails

#### Deployment Steps
1. Create Railway project
2. Add MySQL database
3. Deploy backend (5 min)
4. Deploy frontend (3 min)
5. Test application ✅

See deployment guides for detailed instructions.

---

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Real-time chat support
- [ ] Product recommendations
- [ ] Social media integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Inventory management system
- [ ] Automated email campaigns
- [ ] Product comparison feature

---

Made with ❤️ by the Aureva Team
