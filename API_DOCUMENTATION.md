# 📚 Aureva Beauty API Documentation

Complete API documentation for the Aureva Beauty e-commerce platform.

**Base URL:** `http://localhost:5000/api`

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 👤 User Authentication

### Register User
```http
POST /users/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "token": "jwt_token_here"
}
```

### Login
```http
POST /users/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "token": "jwt_token_here"
}
```

### Forgot Password
```http
POST /users/forgot-password
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset email sent"
}
```

### Reset Password
```http
POST /users/reset-password/:token
```

**Body:**
```json
{
  "password": "newpassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset successful"
}
```

### Get User Profile
```http
GET /users/profile
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

### Update User Profile
```http
PUT /users/profile
```
🔒 **Protected Route**

**Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword" // optional
}
```

---

## 🛍️ Products

### Get All Products
```http
GET /products
```

**Query Parameters:**
- `category` - Filter by category
- `search` - Search by name or description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Response:** `200 OK`
```json
{
  "products": [
    {
      "id": 1,
      "name": "Hydrating Face Serum",
      "description": "Deep hydration serum",
      "price": 29.99,
      "category": "skincare",
      "brand": "Aureva",
      "stock": 50,
      "images": ["url1", "url2"],
      "averageRating": 4.5,
      "numReviews": 10
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 50
  }
}
```

### Get Product by ID
```http
GET /products/:id
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Hydrating Face Serum",
  "description": "Deep hydration serum",
  "price": 29.99,
  "category": "skincare",
  "brand": "Aureva",
  "stock": 50,
  "images": ["url1", "url2"],
  "averageRating": 4.5,
  "numReviews": 10,
  "ingredients": "Water, Hyaluronic Acid...",
  "usage": "Apply twice daily"
}
```

### Get Product Reviews
```http
GET /products/:id/reviews
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "rating": 5,
    "comment": "Amazing product!",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "User": {
      "name": "John Doe"
    }
  }
]
```

### Add Product Review
```http
POST /products/:id/reviews
```
🔒 **Protected Route**

**Body:**
```json
{
  "rating": 5,
  "comment": "Amazing product!"
}
```

**Response:** `201 Created`

---

## 🛒 Shopping Cart

### Get Cart
```http
GET /cart
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": 1,
      "quantity": 2,
      "Product": {
        "id": 1,
        "name": "Hydrating Face Serum",
        "price": 29.99,
        "images": ["url"]
      }
    }
  ],
  "total": 59.98
}
```

### Add to Cart
```http
POST /cart
```
🔒 **Protected Route**

**Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

### Update Cart Item
```http
PUT /cart/:id
```
🔒 **Protected Route**

**Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /cart/:id
```
🔒 **Protected Route**

---

## 📦 Orders

### Get User Orders
```http
GET /orders
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "totalAmount": 59.98,
    "status": "pending",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "OrderItems": [
      {
        "quantity": 2,
        "price": 29.99,
        "Product": {
          "name": "Hydrating Face Serum"
        }
      }
    ]
  }
]
```

### Create Order
```http
POST /orders
```
🔒 **Protected Route**

**Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "couponCode": "SAVE10" // optional
}
```

### Get Order by ID
```http
GET /orders/:id
```
🔒 **Protected Route**

---

## ❤️ Wishlist

### Get Wishlist
```http
GET /wishlist
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "Product": {
      "id": 1,
      "name": "Hydrating Face Serum",
      "price": 29.99,
      "images": ["url"]
    }
  }
]
```

### Add to Wishlist
```http
POST /wishlist
```
🔒 **Protected Route**

**Body:**
```json
{
  "productId": 1
}
```

### Remove from Wishlist
```http
DELETE /wishlist/:id
```
🔒 **Protected Route**

---

## 📍 Addresses

### Get User Addresses
```http
GET /addresses
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "fullName": "John Doe",
    "phone": "+1234567890",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "isDefault": true
  }
]
```

### Add Address
```http
POST /addresses
```
🔒 **Protected Route**

**Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": false
}
```

### Update Address
```http
PUT /addresses/:id
```
🔒 **Protected Route**

### Delete Address
```http
DELETE /addresses/:id
```
🔒 **Protected Route**

---

## 🔔 Notifications

### Get User Notifications
```http
GET /notifications
```
🔒 **Protected Route**

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": 1,
      "title": "Order Shipped",
      "message": "Your order #123 has been shipped",
      "type": "order",
      "isRead": false,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalNotifications": 25
  }
}
```

### Mark Notification as Read
```http
PUT /notifications/:id/read
```
🔒 **Protected Route**

### Mark All as Read
```http
PUT /notifications/read-all
```
🔒 **Protected Route**

### Delete Notification
```http
DELETE /notifications/:id
```
🔒 **Protected Route**

---

## 🎟️ Coupons

### Validate Coupon
```http
POST /coupons/validate
```
🔒 **Protected Route**

**Body:**
```json
{
  "code": "SAVE10",
  "orderTotal": 100
}
```

**Response:** `200 OK`
```json
{
  "valid": true,
  "discount": 10,
  "finalAmount": 90
}
```

---

## 📧 Newsletter

### Subscribe to Newsletter
```http
POST /newsletter/subscribe
```

**Body:**
```json
{
  "email": "john@example.com",
  "name": "John Doe" // optional
}
```

### Unsubscribe from Newsletter
```http
POST /newsletter/unsubscribe
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

---

## 👨‍💼 Admin Routes

All admin routes require admin role.

### Products Management

#### Get All Products (Admin)
```http
GET /admin/products
```
🔒 **Admin Only**

#### Create Product
```http
POST /admin/products
```
🔒 **Admin Only**

**Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 29.99,
  "category": "skincare",
  "brand": "Aureva",
  "stock": 100,
  "images": ["url1", "url2"]
}
```

#### Update Product
```http
PUT /admin/products/:id
```
🔒 **Admin Only**

#### Delete Product
```http
DELETE /admin/products/:id
```
🔒 **Admin Only**

### Orders Management

#### Get All Orders
```http
GET /admin/orders
```
🔒 **Admin Only**

#### Update Order Status
```http
PUT /admin/orders/:id
```
🔒 **Admin Only**

**Body:**
```json
{
  "status": "shipped" // pending, processing, shipped, delivered, cancelled
}
```

### Users Management

#### Get All Users
```http
GET /admin/users
```
🔒 **Admin Only**

#### Update User Role
```http
PUT /admin/users/:id
```
🔒 **Admin Only**

**Body:**
```json
{
  "role": "admin" // customer, admin
}
```

### Coupons Management

#### Get All Coupons
```http
GET /admin/coupons
```
🔒 **Admin Only**

#### Create Coupon
```http
POST /admin/coupons
```
🔒 **Admin Only**

**Body:**
```json
{
  "code": "SAVE10",
  "discount": 10,
  "expiryDate": "2026-12-31",
  "minPurchase": 50
}
```

#### Update Coupon
```http
PUT /admin/coupons/:id
```
🔒 **Admin Only**

#### Delete Coupon
```http
DELETE /admin/coupons/:id
```
🔒 **Admin Only**

### Analytics

#### Get Analytics Data
```http
GET /admin/analytics
```
🔒 **Admin Only**

**Response:** `200 OK`
```json
{
  "totalRevenue": 10000,
  "totalOrders": 150,
  "totalCustomers": 75,
  "averageOrderValue": 66.67,
  "revenueByCategory": {
    "skincare": 4000,
    "makeup": 3000,
    "haircare": 3000
  },
  "topProducts": [
    {
      "name": "Product Name",
      "totalSold": 50,
      "revenue": 1500
    }
  ]
}
```

---

## 📊 Response Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens expire after 30 days
- Protected routes require valid JWT token
- Admin routes require admin role
- Input validation on all endpoints
- SQL injection protection via Sequelize ORM
- CORS enabled for frontend origin

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in USD
- Images are hosted on Cloudinary
- Email notifications are sent via Nodemailer
- Database uses MySQL with Sequelize ORM

---

For more information, visit the [main README](../README.md)
