import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import StoreLayout from '../layouts/StoreLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Store Pages
import Home from '../pages/store/Home';
import ProductList from '../pages/store/ProductList';
import ProductDetails from '../pages/store/ProductDetails';
import Cart from '../pages/store/Cart';
import Checkout from '../pages/store/Checkout';
import Orders from '../pages/store/Orders';
import Profile from '../pages/store/Profile';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';
import Customers from '../pages/admin/Customers';
import Coupons from '../pages/admin/Coupons';
import Reports from '../pages/admin/Reports';

function AppRoutes() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Store Routes */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route
            path="checkout"
            element={user ? <Checkout /> : <Navigate to="/auth/login" />}
          />
          <Route
            path="orders"
            element={user ? <Orders /> : <Navigate to="/auth/login" />}
          />
          <Route
            path="profile"
            element={user ? <Profile /> : <Navigate to="/auth/login" />}
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminLayout /> : <Navigate to="/" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
