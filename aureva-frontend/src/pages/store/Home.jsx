import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiChevronDown, FiLogOut, FiUser, FiPackage, FiSettings, FiSearch, FiMapPin, FiHeart } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { BiLoaderAlt } from 'react-icons/bi';
import { GiLipstick, GiPerfumeBottle, GiComb } from 'react-icons/gi';
import { MdFace, MdChildCare } from 'react-icons/md';
import { IoManSharp, IoWomanSharp } from 'react-icons/io5';
import SearchBar from '../../components/common/SearchBar';
import Footer from '../../components/common/Footer';
import NotificationBell from '../../components/common/NotificationBell';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      const allProducts = response.data.products || [];
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

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setSubscribing(true);
      await axios.post('/api/newsletter/subscribe', { email: newsletterEmail });
      toast.success('Successfully subscribed to newsletter!');
      setNewsletterEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
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
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Search products"
            >
              <FiSearch className="w-6 h-6 text-gray-700" />
            </button>

            <NotificationBell />

            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <FiShoppingCart className="w-6 h-6 text-gray-700" />
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
                  <FiChevronDown className="w-4 h-4 text-gray-600" />
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
                        className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition font-medium flex items-center gap-2"
                      >
                        <FiSettings className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <FiUser className="w-4 h-4" />
                      My Profile
                    </Link>
                    
                    <Link
                      to="/addresses"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <FiMapPin className="w-4 h-4" />
                      My Addresses
                    </Link>
                    
                    <Link
                      to="/wishlist"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <FiHeart className="w-4 h-4" />
                      My Wishlist
                    </Link>
                    
                    <Link
                      to="/orders"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <FiPackage className="w-4 h-4" />
                      My Orders
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
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

      {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}

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
      
      <div className="py-16 px-8 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { name: 'Skincare', icon: HiSparkles, category: 'skincare', color: 'text-purple-500' },
            { name: 'Haircare', icon: GiComb, category: 'haircare', color: 'text-pink-500' },
            { name: 'Makeup', icon: GiLipstick, category: 'makeup', color: 'text-red-500' },
            { name: 'Fragrance', icon: GiPerfumeBottle, category: 'fragrance', color: 'text-indigo-500' },
            { name: "Men's Care", icon: IoManSharp, category: 'men', color: 'text-blue-600' },
            { name: "Women's Care", icon: IoWomanSharp, category: 'women', color: 'text-pink-600' },
            { name: "Kids' Care", icon: MdChildCare, category: 'kids', color: 'text-orange-500' },
            { name: 'Wellness', icon: MdFace, category: 'wellness', color: 'text-green-500' }
          ].map(cat => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.category}
                to={`/products?category=${cat.category}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer group border border-gray-100"
              >
                <IconComponent className={`text-5xl mb-3 mx-auto ${cat.color} group-hover:scale-110 transition-transform`} />
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition">{cat.name}</h3>
              </Link>
            );
          })}
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
              <BiLoaderAlt className="inline-block animate-spin h-12 w-12 text-purple-600" />
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
                    <div className="h-48 bg-white overflow-hidden relative flex items-center justify-center border-b border-gray-100">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <HiSparkles className="text-5xl text-gray-400" />
                        </div>
                      )}
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Only {product.stock} left
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      {product.brand && (
                        <p className="text-xs text-purple-600 font-semibold uppercase mb-1 tracking-wide">
                          {product.brand}
                        </p>
                      )}
                      <h3 className="font-bold text-base text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition min-h-[3rem]">
                        {product.name}
                      </h3>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-purple-600">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {product.stock} in stock
                        </span>
                      </div>
                      
                      <button className="w-full mt-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition text-sm shadow-md">
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
        <form onSubmit={handleNewsletterSubscribe} className="max-w-md mx-auto flex gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-gray-800 outline-none" 
            required
          />
          <button 
            type="submit"
            disabled={subscribing}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            {subscribing ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
