# 🌸 Aureva Beauty E-Commerce Platform

A modern, full-stack e-commerce platform for beauty and cosmetics products built with the MERN stack and optimized for serverless deployment on Vercel.

## 🚀 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Deployment:** Vercel Serverless Functions  
**Storage:** Cloudinary (images)  
**Email:** Nodemailer + Gmail SMTP  
**Auth:** JWT

## 📁 Project Structure

```
aureva/
├── frontend/          # React frontend (Vite)
├── api/              # Vercel serverless functions
├── backend/          # Backend logic (controllers, models, middleware)
├── vercel.json       # Vercel configuration
└── README.md
```

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account with App Password

### Installation

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

**Backend:** http://localhost:5000  
**Frontend:** http://localhost:3000

### Environment Variables

Create `.env` files in `backend/` and `frontend/` directories. See `.env.example` files for required variables.

**Backend (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect `vercel.json`

### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add all variables from `backend/.env`:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `ADMIN_EMAIL`
- `FRONTEND_URL` (your Vercel domain)
- `NODE_ENV=production`
- `BCRYPT_SALT_ROUNDS=12`
- `RATE_LIMIT_WINDOW_MS=900000`
- `RATE_LIMIT_MAX_REQUESTS=100`

### 4. Configure MongoDB Atlas

Add `0.0.0.0/0` to IP whitelist in MongoDB Atlas → Network Access

### 5. Deploy

Click "Deploy" in Vercel dashboard. After deployment, test:

```bash
curl https://your-app.vercel.app/api/health
```

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update profile

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `GET /api/products/search` - Search products

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/users` - Manage users
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/analytics/*` - Analytics

## ✨ Features

### Customer
- Product browsing with filters
- Search with autocomplete
- Shopping cart
- Wishlist
- Product reviews
- Order tracking
- User profile
- Coupon system

### Admin
- Dashboard analytics
- Product management
- User management
- Order management
- Category management
- Coupon management
- Sales reports

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Input sanitization
- XSS protection
- CORS configuration
- Helmet security headers

## 📝 Scripts

```bash
npm run dev              # Start both servers
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run build            # Build frontend
npm run install:all      # Install all dependencies
npm run clean            # Remove all node_modules
```

## 📄 License

MIT License

---

Made with ❤️ by Aureva Team
