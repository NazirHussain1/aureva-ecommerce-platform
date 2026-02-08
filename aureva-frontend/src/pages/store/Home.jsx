import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Aureva Beauty
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition font-medium"
                      >
                        🎛️ Admin Dashboard
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      👤 My Profile
                    </Link>
                    
                    <Link
                      to="/orders"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      📦 My Orders
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-medium shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Aureva Beauty</h1>
        <p className="text-xl mb-8">Discover Your Natural Radiance</p>
        {user ? (
          <p className="text-lg">Hello, {user.name}! 👋</p>
        ) : (
          <Link to="/register" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            Shop Now
          </Link>
        )}
      </div>
      
      <div className="py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {['Skincare', 'Haircare', 'Makeup', 'Fragrance'].map(cat => (
            <Link
              key={cat}
              to="/products"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
            >
              <div className="text-5xl mb-3">✨</div>
              <h3 className="font-semibold text-gray-800">{cat}</h3>
            </Link>
          ))}
        </div>
      </div>

      <div className="py-16 px-8 bg-white text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Featured Products</h2>
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-600 text-lg mb-4">No products yet</p>
        {user?.role === 'admin' ? (
          <Link to="/admin" className="text-purple-600 hover:underline font-medium">
            Go to Admin Panel to add products →
          </Link>
        ) : (
          <p className="text-gray-500">Products will appear here soon</p>
        )}
      </div>

      <div className="bg-purple-600 text-white py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Subscribe to Newsletter</h2>
        <p className="mb-8">Get exclusive offers and beauty tips</p>
        <div className="max-w-md mx-auto flex gap-2">
          <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-gray-800" />
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Subscribe</button>
        </div>
      </div>

      <div className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>© 2026 Aureva Beauty. All rights reserved.</p>
      </div>
    </div>
  );
}
