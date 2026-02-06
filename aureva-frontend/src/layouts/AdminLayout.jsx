import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useState } from 'react';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: '🛍️', label: 'Products' },
    { path: '/admin/orders', icon: '📦', label: 'Orders' },
    { path: '/admin/customers', icon: '👥', label: 'Customers' },
    { path: '/admin/coupons', icon: '🎟️', label: 'Coupons' },
    { path: '/admin/reports', icon: '📈', label: 'Reports' }
  ];

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="container-custom flex items-center justify-between py-4 px-6">
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-800 lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Aureva Admin
                </h1>
                <p className="text-xs text-gray-500">Management Dashboard</p>
              </div>
            </Link>
          </div>

          {/* User & Store links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">View Store</span>
            </Link>

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center space-x-2 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-white shadow-lg transition-all duration-300 overflow-hidden ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition group ${
                      isActive(item.path, item.exact)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className={`${!sidebarOpen && 'hidden lg:block font-medium'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
