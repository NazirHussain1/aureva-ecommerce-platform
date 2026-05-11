# 🚀 DEVELOPER QUICK REFERENCE

## Aureva Beauty - Architecture Standards

---

## 📚 HOOKS USAGE

### useAuth() - Authentication
```javascript
import useAuth from '../hooks/useAuth';

const { user, token, loading, isAuthenticated, isAdmin, logout } = useAuth();

// Check if user is logged in
if (isAuthenticated) { ... }

// Check if user is admin
if (isAdmin) { ... }

// Logout user
logout();
```

### useCart() - Shopping Cart
```javascript
import useCart from '../hooks/useCart';

const { items, total, cartCount, isEmpty, hasItem, getItemQuantity } = useCart();

// Get cart count
<Badge>{cartCount}</Badge>

// Check if cart is empty
if (isEmpty) { ... }

// Check if product is in cart
if (hasItem(productId)) { ... }

// Get quantity of specific product
const qty = getItemQuantity(productId);
```

### useSocket() - WebSocket
```javascript
import useSocket from '../hooks/useSocket';

const { socket, isConnected, connect, disconnect, emit, on } = useSocket();

// Connect to socket
useEffect(() => {
  connect();
  return () => disconnect();
}, []);

// Emit event
emit('message', { text: 'Hello' });

// Listen to event
useEffect(() => {
  on('notification', (data) => {
    console.log('Received:', data);
  });
}, []);
```

---

## 🌐 API USAGE

### Authentication API
```javascript
import { authApi } from '../api/authApi';

// Register
await authApi.register({ name, email, password });

// Login
await authApi.login({ email, password });

// Logout
await authApi.logout();

// Get profile
await authApi.getProfile();

// Forgot password
await authApi.forgotPassword(email);

// Reset password
await authApi.resetPassword(token, newPassword);
```

### Cart API
```javascript
import { cartApi } from '../api/cartApi';

// Get cart
await cartApi.getCart();

// Add to cart
await cartApi.addToCart(productId, quantity);

// Update cart item
await cartApi.updateCartItem(itemId, quantity);

// Remove from cart
await cartApi.removeFromCart(itemId);
```

### Order API
```javascript
import { orderApi } from '../api/orderApi';

// Place order
await orderApi.placeOrder(orderData);

// Get user orders
await orderApi.getUserOrders();

// Get order by ID
await orderApi.getOrderById(orderId);

// Cancel order
await orderApi.cancelOrder(orderId, reason);

// Return order
await orderApi.returnOrder(orderId, reason);
```

### Product API
```javascript
import { productApi } from '../api/productApi';

// Get products (with filters)
await productApi.getProducts({ category: 'skincare', limit: 10 });

// Get product by ID
await productApi.getProductById(productId);

// Create product (admin)
await productApi.createProduct(productData);

// Update product (admin)
await productApi.updateProduct(productId, productData);

// Delete product (admin)
await productApi.deleteProduct(productId);

// Get product reviews
await productApi.getProductReviews(productId);

// Create review
await productApi.createReview(productId, reviewData);

// Delete review
await productApi.deleteReview(reviewId);
```

### Payment API
```javascript
import { paymentApi } from '../api/paymentApi';

// Process payment
await paymentApi.processPayment(paymentData);

// Get payment history
await paymentApi.getPaymentHistory();

// Get payment details
await paymentApi.getPaymentDetails(paymentId);
```

### Contact API
```javascript
import { submitContactForm, getAllMessages, getMessageById, markMessageAsRead, deleteMessage } from '../api/contactApi';

// Submit contact form
await submitContactForm({ name, email, subject, message });

// Get all messages (admin)
await getAllMessages({ page: 1, limit: 10 });

// Get message by ID (admin)
await getMessageById(messageId);

// Mark as read (admin)
await markMessageAsRead(messageId);

// Delete message (admin)
await deleteMessage(messageId);
```

### Settings API
```javascript
import { getPublicSettings, getSettings, updateSettings } from '../api/settingsApi';

// Get public settings
await getPublicSettings();

// Get all settings (admin)
await getSettings();

// Update settings (admin)
await updateSettings(settingsData);
```

---

## 🎨 REDUX USAGE

### Dispatch Actions
```javascript
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { login, logout, updateUser } from '../features/auth/authSlice';

const dispatch = useDispatch();

// Cart actions
dispatch(addToCart({ product, quantity: 1 }));
dispatch(removeFromCart(productId));
dispatch(updateQuantity({ productId, quantity: 2 }));
dispatch(clearCart());

// Wishlist actions
dispatch(addToWishlist(product));
dispatch(removeFromWishlist(productId));

// Auth actions
dispatch(login({ email, password }));
dispatch(logout());
dispatch(updateUser({ name: 'New Name' }));
```

### Select State
```javascript
import { useSelector } from 'react-redux';

// Auth state
const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

// Cart state
const { items, total } = useSelector((state) => state.cart);

// Wishlist state
const { items } = useSelector((state) => state.wishlist);

// Products state
const { items, currentProduct, isLoading, error } = useSelector((state) => state.products);

// Orders state
const { items, isLoading, error, placingOrder, lastOrder } = useSelector((state) => state.orders);
```

---

## 🛠️ UTILITY FUNCTIONS

### Product Helpers
```javascript
import { isLowStock, isOutOfStock, isInStock, getStockStatus, getStockStatusColor } from '../utils/productHelpers';

// Check stock status
if (isOutOfStock(product.stock)) {
  // Show out of stock message
}

if (isLowStock(product.stock)) {
  // Show low stock warning
}

// Get status label
const status = getStockStatus(product.stock); // "In Stock", "Low Stock", "Out of Stock"

// Get status color class
const colorClass = getStockStatusColor(product.stock); // "text-green-600", "text-orange-600", "text-red-600"
```

### Formatters
```javascript
import { formatPrice, formatDate, formatDateTime, truncateText } from '../utils/formatters';

// Format price
formatPrice(29.99); // "$29.99"

// Format date
formatDate(new Date()); // "May 11, 2026"

// Format date and time
formatDateTime(new Date()); // "May 11, 2026, 10:30 AM"

// Truncate text
truncateText("Long text here...", 20); // "Long text here..."
```

### Helpers
```javascript
import { calculateCartTotal, validateEmail, validatePassword, getImageUrl, debounce, generateSlug, getProductUrl } from '../utils/helpers';

// Calculate cart total
const total = calculateCartTotal(cartItems);

// Validate email
if (validateEmail(email)) { ... }

// Validate password
if (validatePassword(password)) { ... }

// Get image URL
const imageUrl = getImageUrl(product.images[0]);

// Debounce function
const debouncedSearch = debounce(searchFunction, 300);

// Generate slug
const slug = generateSlug("Product Name"); // "product-name"

// Get product URL
const url = getProductUrl(product); // "/products/product-slug"
```

### Constants
```javascript
import { CATEGORIES, ORDER_STATUS, PAYMENT_METHODS, API_BASE_URL } from '../utils/constants';

// Categories
CATEGORIES.forEach(cat => console.log(cat.value, cat.label));

// Order status
const status = ORDER_STATUS.shipped; // "Shipped"

// Payment methods
PAYMENT_METHODS.forEach(method => console.log(method.value, method.label));

// API base URL
console.log(API_BASE_URL); // "http://localhost:5000/api" or production URL
```

---

## 🎯 COMMON PATTERNS

### API Call with Error Handling
```javascript
import toast from 'react-hot-toast';
import { productApi } from '../api/productApi';

const handleFetchProducts = async () => {
  try {
    const response = await productApi.getProducts({ category: 'skincare' });
    setProducts(response.data);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch products');
  }
};
```

### Protected Route Check
```javascript
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

function ProtectedPage() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <div>Protected content</div>;
}
```

### Admin-Only Check
```javascript
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

function AdminPage() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <div>Admin content</div>;
}
```

### Add to Cart with Validation
```javascript
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { isOutOfStock } from '../utils/productHelpers';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    if (isOutOfStock(product.stock)) {
      toast.error('This product is out of stock');
      return;
    }
    
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };
  
  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

---

## 🔒 ENVIRONMENT VARIABLES

### Required Variables
```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
VITE_FACEBOOK_PIXEL_ID=your_fb_pixel_id
```

### Usage in Code
```javascript
// Get API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get analytics ID
const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
```

---

## ⚠️ DO's and DON'Ts

### ✅ DO:
- Use hooks for reusable logic
- Use API modules for backend calls
- Use Redux for global state
- Use environment variables for URLs
- Handle errors with try/catch
- Show user feedback with toast
- Validate user input
- Check authentication before protected actions

### ❌ DON'T:
- Don't use fetch() directly (use axios)
- Don't hardcode URLs
- Don't mix hook responsibilities
- Don't skip error handling
- Don't forget to validate input
- Don't expose sensitive data
- Don't skip loading states
- Don't forget to clean up effects

---

## 🐛 DEBUGGING TIPS

### Check Redux State
```javascript
// In browser console
window.__REDUX_DEVTOOLS_EXTENSION__

// Or use React DevTools
// Components tab → Select component → View hooks/props
```

### Check API Calls
```javascript
// In browser console → Network tab
// Filter by XHR/Fetch
// Check request/response
```

### Check Authentication
```javascript
// In browser console
localStorage.getItem('token')
localStorage.getItem('user')
```

### Common Issues

**Issue:** API calls return 401
**Solution:** Check if token exists and is valid

**Issue:** Component not re-rendering
**Solution:** Check if Redux state is updating

**Issue:** Hook not working
**Solution:** Ensure hook is called at top level of component

**Issue:** Image not loading
**Solution:** Check image URL and CORS settings

---

## 📞 QUICK LINKS

- **Redux DevTools:** [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools)
- **React DevTools:** [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools)
- **Axios Docs:** https://axios-http.com/docs/intro
- **Redux Toolkit Docs:** https://redux-toolkit.js.org/
- **React Router Docs:** https://reactrouter.com/

---

**Last Updated:** 2026-05-11  
**Version:** 1.0
