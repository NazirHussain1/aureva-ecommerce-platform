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

      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-purple-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-700">New Arrivals Available</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="block text-gray-900">Discover Your</span>
                  <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Natural Radiance
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Premium beauty products crafted with care. Elevate your skincare routine with our curated collection of luxury essentials.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Now
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Explore Categories
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders $50+</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% Protected</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
                    <p className="text-xs text-gray-500">10-day policy</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-[3rem] transform rotate-3 opacity-20"></div>
              <div className="relative bg-white rounded-[3rem] shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                <div className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl transform rotate-12 hover:rotate-0 transition-transform">
                  <p className="text-sm font-bold">50% OFF</p>
                  <p className="text-xs">Limited Time</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="w-full h-40 bg-white rounded-xl mb-4 flex items-center justify-center shadow-sm">
                      <HiSparkles className="text-6xl text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">Skincare</h3>
                    <p className="text-sm text-gray-600">Premium Collection</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="w-full h-40 bg-white rounded-xl mb-4 flex items-center justify-center shadow-sm">
                      <GiLipstick className="text-6xl text-pink-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">Makeup</h3>
                    <p className="text-sm text-gray-600">Trending Shades</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="w-full h-40 bg-white rounded-xl mb-4 flex items-center justify-center shadow-sm">
                      <GiPerfumeBottle className="text-6xl text-indigo-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">Fragrance</h3>
                    <p className="text-sm text-gray-600">Luxury Scents</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="w-full h-40 bg-white rounded-xl mb-4 flex items-center justify-center shadow-sm">
                      <GiComb className="text-6xl text-teal-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">Haircare</h3>
                    <p className="text-sm text-gray-600">Salon Quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-lg text-gray-600">Explore our curated collections for every beauty need</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'Skincare', icon: HiSparkles, category: 'skincare', gradient: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
              { name: 'Haircare', icon: GiComb, category: 'haircare', gradient: 'from-pink-400 to-pink-600', bg: 'bg-pink-50' },
              { name: 'Makeup', icon: GiLipstick, category: 'makeup', gradient: 'from-red-400 to-red-600', bg: 'bg-red-50' },
              { name: 'Fragrance', icon: GiPerfumeBottle, category: 'fragrance', gradient: 'from-indigo-400 to-indigo-600', bg: 'bg-indigo-50' },
              { name: "Men's Care", icon: IoManSharp, category: 'men', gradient: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' },
              { name: "Women's Care", icon: IoWomanSharp, category: 'women', gradient: 'from-pink-500 to-pink-700', bg: 'bg-pink-50' },
              { name: "Kids' Care", icon: MdChildCare, category: 'kids', gradient: 'from-orange-400 to-orange-600', bg: 'bg-orange-50' },
              { name: 'Wellness', icon: MdFace, category: 'wellness', gradient: 'from-green-400 to-green-600', bg: 'bg-green-50' }
            ].map(cat => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.category}
                  to={`/products?category=${cat.category}`}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative p-6 sm:p-8 flex flex-col items-center">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 ${cat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <IconComponent className={`text-3xl sm:text-4xl bg-gradient-to-br ${cat.gradient} bg-clip-text text-transparent`} />
                    </div>
                    
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 text-center">
                      {cat.name}
                    </h3>
                    
                    <div className="mt-3 flex items-center gap-1 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">Explore</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <HiSparkles className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
            <p className="text-lg text-gray-600">Discover our best-selling beauty essentials</p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
                <BiLoaderAlt className="animate-spin h-8 w-8 text-purple-600" />
              </div>
              <p className="text-gray-600 text-lg">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl">
              <div className="text-7xl mb-4">📦</div>
              <p className="text-gray-600 text-xl mb-2">No products available yet</p>
              <p className="text-gray-500 mb-6">Check back soon for amazing beauty products</p>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/products" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Products
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <Link to={`/products/${product.id}`} className="block">
                      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HiSparkles className="text-6xl text-gray-300" />
                          </div>
                        )}
                        
                        {product.stock < 10 && product.stock > 0 && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                            Only {product.stock} left!
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="p-5">
                        {product.brand && (
                          <p className="text-xs text-purple-600 font-bold uppercase mb-2 tracking-wider">
                            {product.brand}
                          </p>
                        )}
                        
                        <h3 className="font-bold text-base text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition min-h-[3rem] leading-snug">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              ${Number(product.price).toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span className="font-medium">{product.stock} in stock</span>
                          </div>
                        </div>
                        
                        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-105">
                          <span>View Details</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <span>View All Products</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <HiSparkles className="w-4 h-4" />
            <span>Stay Updated</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Subscribe to Newsletter</h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Get exclusive offers, beauty tips, and early access to new products delivered to your inbox
          </p>
          
          <form onSubmit={handleNewsletterSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 outline-none focus:ring-4 focus:ring-white/30 transition shadow-lg placeholder:text-gray-400" 
                required
              />
              <button 
                type="submit"
                disabled={subscribing}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap"
              >
                {subscribing ? (
                  <span className="flex items-center gap-2">
                    <BiLoaderAlt className="animate-spin w-5 h-5" />
                    Subscribing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Subscribe Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
            
            <p className="text-sm text-purple-100 mt-4">
              Join 10,000+ beauty enthusiasts. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
