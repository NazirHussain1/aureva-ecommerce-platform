import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiSearch, FiChevronDown, FiLogOut, FiUser, FiPackage, FiSettings, FiMapPin, FiHeart } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import { GiLipstick, GiPerfumeBottle, GiComb } from 'react-icons/gi';
import { MdFace, MdChildCare } from 'react-icons/md';
import { IoManSharp, IoWomanSharp } from 'react-icons/io5';
import Footer from '../../components/common/Footer';
import NotificationBell from '../../components/common/NotificationBell';

export default function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('category');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    }
  }, [searchParams]);

  const categories = [
    { value: 'skincare', label: 'Skincare', icon: HiSparkles, color: 'text-purple-500' },
    { value: 'haircare', label: 'Haircare', icon: GiComb, color: 'text-pink-500' },
    { value: 'makeup', label: 'Makeup', icon: GiLipstick, color: 'text-red-500' },
    { value: 'fragrance', label: 'Fragrance', icon: GiPerfumeBottle, color: 'text-indigo-500' },
    { value: 'men', label: "Men's Care", icon: IoManSharp, color: 'text-blue-600' },
    { value: 'women', label: "Women's Care", icon: IoWomanSharp, color: 'text-pink-600' },
    { value: 'kids', label: "Kids' Care", icon: MdChildCare, color: 'text-orange-500' },
    { value: 'wellness', label: 'Wellness', icon: MdFace, color: 'text-green-500' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    document.title = 'Products - Aureva Beauty';
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && product.stock > 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Aureva Beauty
              </h1>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium transition">
                Home
              </Link>
              <Link to="/products" className="text-purple-600 font-semibold border-b-2 border-purple-600">
                Products
              </Link>
              <Link to="/cart" className="text-gray-700 hover:text-purple-600 font-medium transition">
                Cart
              </Link>
            </nav>

            <div className="flex items-center gap-4">
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
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <FiChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
                <Link to="/login" className="text-gray-700 hover:text-purple-600 font-medium">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our collection of premium beauty products</p>
        </div>

        <div className="mb-8 relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg"
          />
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full font-medium transition shadow-sm ${
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Products
            </button>
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-2 rounded-full font-medium transition shadow-sm flex items-center gap-2 ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <IconComponent className={`text-lg ${selectedCategory === category.value ? 'text-white' : category.color}`} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <BiLoaderAlt className="inline-block animate-spin h-16 w-16 text-purple-600" />
            <p className="text-gray-600 mt-4 text-lg">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="h-64 bg-white overflow-hidden relative flex items-center justify-center border-b border-gray-100">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <HiSparkles className="text-6xl text-gray-400" />
                    </div>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  {product.brand && (
                    <p className="text-xs text-purple-600 font-semibold uppercase mb-1 tracking-wide">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition min-h-[3.5rem]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-purple-600">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {product.stock} in stock
                    </span>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-md">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
