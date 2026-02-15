import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import axios from '../../api/axios';
import { 
  FiSearch, 
  FiHeart, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiChevronDown,
  FiLogOut,
  FiPackage,
  FiMapPin,
  FiSettings
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { GiLipstick, GiPerfumeBottle, GiComb } from 'react-icons/gi';
import { MdFace, MdChildCare } from 'react-icons/md';
import { IoManSharp, IoWomanSharp } from 'react-icons/io5';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserDropdown(false);
    setShowCategoriesDropdown(false);
    setSearchFocused(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);
        const response = await axios.get(`/api/products?search=${searchQuery}&limit=5`);
        setSearchResults(response.data.products || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchFocused(false);
      setSearchQuery('');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchFocused(false);
    setSearchQuery('');
  };

  const categories = [
    { name: 'Skincare', value: 'skincare', icon: HiSparkles, color: 'text-purple-500' },
    { name: 'Haircare', value: 'haircare', icon: GiComb, color: 'text-pink-500' },
    { name: 'Makeup', value: 'makeup', icon: GiLipstick, color: 'text-red-500' },
    { name: 'Fragrance', value: 'fragrance', icon: GiPerfumeBottle, color: 'text-indigo-500' },
    { name: "Men's Care", value: 'men', icon: IoManSharp, color: 'text-blue-600' },
    { name: "Women's Care", value: 'women', icon: IoWomanSharp, color: 'text-pink-600' },
    { name: "Kids' Care", value: 'kids', icon: MdChildCare, color: 'text-orange-500' },
    { name: 'Wellness', value: 'wellness', icon: MdFace, color: 'text-green-500' }
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-xl shadow-xl' 
          : 'bg-white/95 backdrop-blur-md shadow-md'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            <div className="flex items-center gap-4 lg:gap-10">
              <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <HiSparkles className="text-white text-lg sm:text-xl" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Aureva
                </h1>
              </Link>

              <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3 xl:px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl group whitespace-nowrap ${
                      isActive(link.path)
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full transform transition-all duration-300 ${
                      isActive(link.path) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                    }`}></span>
                  </Link>
                ))}

                <div className="relative">
                  <button
                    onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                    onMouseEnter={() => setShowCategoriesDropdown(true)}
                    className={`flex items-center gap-1.5 px-3 xl:px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl whitespace-nowrap ${
                      showCategoriesDropdown
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    Categories
                    <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      showCategoriesDropdown ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {showCategoriesDropdown && (
                    <div 
                      className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 animate-fadeIn"
                      onMouseLeave={() => setShowCategoriesDropdown(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Browse Categories</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {categories.map((cat) => {
                          const IconComponent = cat.icon;
                          return (
                            <Link
                              key={cat.value}
                              to={`/products?category=${cat.value}`}
                              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group"
                            >
                              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                <IconComponent className={`text-xl ${cat.color}`} />
                              </div>
                              <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                                {cat.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <div ref={searchRef} className="hidden md:block relative">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className={`flex items-center transition-all duration-300 ${
                    searchFocused ? 'w-56 lg:w-80' : 'w-44 lg:w-64'
                  }`}>
                    <FiSearch className="absolute left-3 lg:left-4 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      placeholder="Search..."
                      className={`w-full pl-9 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-2.5 bg-gray-50 border-2 rounded-full text-xs lg:text-sm font-medium text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-300 ${
                        searchFocused 
                          ? 'border-purple-300 bg-white shadow-lg' 
                          : 'border-transparent hover:bg-gray-100'
                      }`}
                    />
                  </div>
                </form>

                {searchFocused && (searchQuery.length >= 2 || searchLoading) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 max-h-96 overflow-y-auto animate-fadeIn">
                    {searchLoading ? (
                      <div className="px-4 py-8 text-center">
                        <div className="inline-block w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 mt-2">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Results</p>
                        </div>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                              {product.images && product.images[0] ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <HiSparkles className="text-2xl text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                ${Number(product.price).toFixed(2)}
                              </p>
                            </div>
                          </button>
                        ))}
                        <div className="px-4 py-3 border-t border-gray-100">
                          <button
                            onClick={() => {
                              navigate(`/products?search=${searchQuery}`);
                              setSearchFocused(false);
                            }}
                            className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                          >
                            View all results →
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-gray-500">No products found</p>
                        <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {user && (
                <>
                  <NotificationBell />

                  <Link 
                    to="/wishlist" 
                    className="relative p-2 lg:p-3 hover:bg-purple-50 rounded-full transition-all duration-300 hover:scale-110 group"
                    title="Wishlist"
                  >
                    <FiHeart className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
                    {wishlistItems?.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 lg:-top-1 lg:-right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] lg:text-xs font-bold rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center shadow-lg animate-pulse">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <Link 
                to="/cart" 
                className="relative p-2 lg:p-3 hover:bg-purple-50 rounded-full transition-all duration-300 hover:scale-110 group"
                title="Shopping cart"
              >
                <FiShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
                {items?.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 lg:-top-1 lg:-right-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] lg:text-xs font-bold rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center shadow-lg animate-pulse">
                    {items.length}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-1.5 lg:gap-2.5 hover:bg-purple-50 px-2 lg:px-3 py-1.5 lg:py-2 rounded-full transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <FiChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 text-gray-600 transition-transform duration-300 ${
                      showUserDropdown ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold rounded-full">
                          {user.role}
                        </span>
                      </div>
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 transition-all duration-300 font-semibold group"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FiSettings className="w-4 h-4" />
                          </div>
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FiUser className="w-4 h-4" />
                        </div>
                        My Profile
                      </Link>
                      
                      <Link
                        to="/addresses"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FiMapPin className="w-4 h-4" />
                        </div>
                        My Addresses
                      </Link>
                      
                      <Link
                        to="/wishlist"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FiHeart className="w-4 h-4" />
                        </div>
                        My Wishlist
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FiPackage className="w-4 h-4" />
                        </div>
                        My Orders
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FiLogOut className="w-4 h-4" />
                          </div>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link 
                    to="/login" 
                    className="px-3 xl:px-5 py-2 xl:py-2.5 text-xs xl:text-sm font-semibold text-gray-700 hover:text-purple-600 transition-all duration-300 rounded-xl hover:bg-gray-50 whitespace-nowrap"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 xl:px-6 py-2 xl:py-2.5 text-xs xl:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-full hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-purple-50 rounded-full transition-all duration-300"
              >
                {showMobileMenu ? (
                  <FiX className="w-5 h-5 text-gray-700" />
                ) : (
                  <FiMenu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-full text-sm font-medium text-gray-700 placeholder:text-gray-400 outline-none focus:border-purple-300 focus:bg-white focus:shadow-lg transition-all duration-300"
              />
            </form>
          </div>
        </div>
      </nav>

      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          
          <div className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto">
            <div className="p-6 space-y-6">
              {user && (
                <div className="pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-purple-600 bg-purple-50 rounded-xl font-semibold mb-2 hover:bg-purple-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FiSettings className="w-5 h-5" />
                      </div>
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-2"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FiUser className="w-5 h-5" />
                    </div>
                    My Profile
                  </Link>
                  
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FiPackage className="w-5 h-5" />
                    </div>
                    My Orders
                  </Link>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      isActive(link.path)
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4">Categories</p>
                {categories.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <Link
                      key={cat.value}
                      to={`/products?category=${cat.value}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className={`text-xl ${cat.color}`} />
                      </div>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  );
                })}
              </div>

              {!user && (
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <Link 
                    to="/login" 
                    className="block w-full px-6 py-3 text-center text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full px-6 py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {user && (
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
