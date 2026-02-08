import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import store from './app/store';
import Home from './pages/store/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<div className="p-6"><h1 className="text-2xl font-bold">Products Page - Coming Soon</h1></div>} />
          <Route path="orders" element={<div className="p-6"><h1 className="text-2xl font-bold">Orders Page - Coming Soon</h1></div>} />
          <Route path="customers" element={<div className="p-6"><h1 className="text-2xl font-bold">Customers Page - Coming Soon</h1></div>} />
          <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports Page - Coming Soon</h1></div>} />
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
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
