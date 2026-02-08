import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import axios from '../../api/axios';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      const allProducts = response.data.data || [];
      setProducts(allProducts.filter(p => p.stock > 0).slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

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

      <div className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
            <p className="text-gray-600">Discover our best-selling beauty essentials</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg mb-4">No products available yet</p>
              {user?.role === 'admin' && (
                <Link to="/admin/products" className="text-purple-600 hover:underline font-medium">
                  Go to Admin Panel to add products →
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {products.map(product => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100"
                  >
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          🧴
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      {product.brand && (
                        <p className="text-xs text-purple-600 font-semibold uppercase mb-1">
                          {product.brand}
                        </p>
                      )}
                      <h3 className="font-bold text-base text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                        {product.name}
                      </h3>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-purple-600">
                          ${product.price}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.stock} left
                        </span>
                      </div>
                      
                      <button className="w-full mt-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition text-sm">
                        View Details
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
                >
                  View All Products →
                </Link>
              </div>
            </>
          )}
        </div>
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
