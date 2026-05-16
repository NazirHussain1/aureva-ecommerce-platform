import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import store from './app/store';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';

const Home = lazy(() => import('./pages/store/Home'));
const Products = lazy(() => import('./pages/store/Products'));
const ProductDetails = lazy(() => import('./pages/store/ProductDetails'));
const Cart = lazy(() => import('./pages/store/Cart'));
const Checkout = lazy(() => import('./pages/store/Checkout'));
const Orders = lazy(() => import('./pages/store/Orders'));
const Profile = lazy(() => import('./pages/store/Profile'));
const Addresses = lazy(() => import('./pages/store/Addresses'));
const Wishlist = lazy(() => import('./pages/store/Wishlist'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const Coupons = lazy(() => import('./pages/admin/Coupons'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const SiteSettings = lazy(() => import('./pages/admin/SiteSettings'));
const ContactMessages = lazy(() => import('./pages/admin/ContactMessages'));
const AboutUs = lazy(() => import('./pages/info/AboutUs'));
const ContactUs = lazy(() => import('./pages/info/ContactUs'));
const FAQ = lazy(() => import('./pages/info/FAQ'));
const Returns = lazy(() => import('./pages/info/Returns'));
const ShippingInfo = lazy(() => import('./pages/info/ShippingInfo'));
const TermsOfService = lazy(() => import('./pages/info/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/info/PrivacyPolicy'));
const Careers = lazy(() => import('./pages/info/Careers'));

function PageFallback() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-plum-800" />
    </div>
  );
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function PublicRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  
  if (isAuthenticated && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Router>
      <FloatingWhatsApp />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:identifier" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/addresses" element={
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          } />
          
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          
          <Route path="/reset-password/:token" element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } />
          
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/careers" element={<Careers />} />
          
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="site-settings" element={<SiteSettings />} />
            <Route path="contact-messages" element={<ContactMessages />} />
          </Route>
          
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-4">Page not found</p>
                <Link to="/" className="text-purple-600 hover:underline">Go Home</Link>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppRoutes />
    </Provider>
  );
}

export default App;
