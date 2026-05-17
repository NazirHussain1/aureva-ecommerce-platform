import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiChevronDown,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiSearch,
  FiSettings,
  FiShoppingCart,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { GiComb, GiLipstick, GiPerfumeBottle } from 'react-icons/gi';
import { HiSparkles } from 'react-icons/hi';
import { IoManSharp, IoWomanSharp } from 'react-icons/io5';
import { MdChildCare, MdFace } from 'react-icons/md';
import axios from '../../api/axios';
import { logout } from '../../features/auth/authSlice';
import { getProductUrl } from '../../utils/helpers';
import NotificationBell from './NotificationBell';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const categories = [
  { name: 'Skincare', value: 'skincare', icon: HiSparkles },
  { name: 'Haircare', value: 'haircare', icon: GiComb },
  { name: 'Makeup', value: 'makeup', icon: GiLipstick },
  { name: 'Fragrance', value: 'fragrance', icon: GiPerfumeBottle },
  { name: "Men's Care", value: 'men', icon: IoManSharp },
  { name: "Women's Care", value: 'women', icon: IoWomanSharp },
  { name: "Kids' Care", value: 'kids', icon: MdChildCare },
  { name: 'Wellness', value: 'wellness', icon: MdFace },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [scrolled, setScrolled] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
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
        const response = await axios.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        setSearchResults(response.data.products || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
    navigate('/');
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchFocused(false);
    setSearchQuery('');
  };

  const openProduct = (product) => {
    navigate(getProductUrl(product));
    setSearchFocused(false);
    setSearchQuery('');
  };

  const badge = (count) => (
    count > 0 ? (
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-plum-900 px-1 text-[11px] font-semibold text-white">
        {count}
      </span>
    ) : null
  );

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled ? 'border-stone-200 bg-white/95 shadow-sm backdrop-blur' : 'border-stone-100 bg-white/90 backdrop-blur'
        }`}
      >
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex shrink-0 items-center gap-3 text-stone-950">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-plum-900 text-base font-semibold text-white">
                  A
                </span>
                <span className="text-xl font-semibold">Aureva</span>
              </Link>

              <div className="hidden items-center gap-1 lg:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      isActive(link.path)
                        ? 'bg-ivory-100 text-plum-900'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-plum-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div
                  className="relative"
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                >
                  <button
                    type="button"
                    onClick={() => setShowCategoriesDropdown((value) => !value)}
                    className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-plum-900"
                  >
                    Categories
                    <FiChevronDown className={`h-4 w-4 transition ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showCategoriesDropdown && (
                    <div className="absolute left-0 top-full w-80 pt-3">
                      <div className="rounded-lg border border-stone-200 bg-white p-2 shadow-lg">
                        <div className="border-b border-stone-100 px-3 py-2">
                          <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">
                            Shop categories
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-1 pt-2">
                          {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                              <Link
                                key={category.value}
                                to={`/products?category=${category.value}`}
                                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-stone-700 transition hover:bg-ivory-100 hover:text-plum-900"
                              >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-50 text-plum-800">
                                  <Icon className="h-5 w-5" />
                                </span>
                                {category.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div ref={searchRef} className="relative hidden md:block">
                <form onSubmit={submitSearch} className="relative">
                  <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search products"
                    className="h-10 w-56 rounded-lg border border-stone-200 bg-white pl-10 pr-3 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100 lg:w-72"
                  />
                </form>

                {searchFocused && (searchQuery.length >= 2 || searchLoading) && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-stone-200 bg-white py-2 shadow-lg">
                    {searchLoading ? (
                      <p className="px-4 py-6 text-center text-sm text-stone-500">Searching...</p>
                    ) : searchResults.length ? (
                      <>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => openProduct(product)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-ivory-100"
                          >
                            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                              {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-plum-800">
                                  <HiSparkles className="h-5 w-5" />
                                </span>
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-stone-800">{product.name}</span>
                              <span className="text-xs text-stone-500">${Number(product.price).toFixed(2)}</span>
                            </span>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                            setSearchFocused(false);
                          }}
                          className="w-full border-t border-stone-100 px-4 py-3 text-left text-sm font-semibold text-plum-800 hover:bg-ivory-100"
                        >
                          View all results
                        </button>
                      </>
                    ) : (
                      <p className="px-4 py-6 text-center text-sm text-stone-500">No products found</p>
                    )}
                  </div>
                )}
              </div>

              {user && <NotificationBell />}

              {user && (
                <Link to="/wishlist" className="relative rounded-lg p-2.5 text-stone-600 transition hover:bg-ivory-100 hover:text-plum-900" title="Wishlist">
                  <FiHeart className="h-5 w-5" />
                  {badge(wishlistItems?.length || 0)}
                </Link>
              )}

              <Link to="/cart" className="relative rounded-lg p-2.5 text-stone-600 transition hover:bg-ivory-100 hover:text-plum-900" title="Cart">
                <FiShoppingCart className="h-5 w-5" />
                {badge(items?.length || 0)}
              </Link>

              {user ? (
                <div className="relative hidden lg:block">
                  <button
                    type="button"
                    onClick={() => setShowUserDropdown((value) => !value)}
                    className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm font-semibold text-stone-700 transition hover:border-rose-200 hover:bg-ivory-100"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-plum-900 text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    <FiChevronDown className={`h-4 w-4 transition ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-stone-200 bg-white py-2 shadow-lg">
                      <div className="border-b border-stone-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-stone-900">{user.name}</p>
                        <p className="truncate text-xs text-stone-500">{user.email}</p>
                      </div>

                      {user.role === 'admin' && (
                        <DropdownLink to="/admin" icon={FiSettings} label="Admin Dashboard" close={() => setShowUserDropdown(false)} />
                      )}
                      <DropdownLink to="/profile" icon={FiUser} label="My Profile" close={() => setShowUserDropdown(false)} />
                      <DropdownLink to="/addresses" icon={FiMapPin} label="My Addresses" close={() => setShowUserDropdown(false)} />
                      <DropdownLink to="/wishlist" icon={FiHeart} label="My Wishlist" close={() => setShowUserDropdown(false)} />
                      <DropdownLink to="/orders" icon={FiPackage} label="My Orders" close={() => setShowUserDropdown(false)} />

                      <div className="mt-1 border-t border-stone-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <FiLogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden items-center gap-2 lg:flex">
                  <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 hover:text-plum-900">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-lg bg-plum-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-plum-950">
                    Sign up
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowMobileMenu((value) => !value)}
                className="rounded-lg p-2.5 text-stone-700 transition hover:bg-ivory-100 lg:hidden"
                aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              >
                {showMobileMenu ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <form onSubmit={submitSearch} className="relative pb-3 md:hidden">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-[calc(50%+6px)] text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              className="h-10 w-full rounded-lg border border-stone-200 bg-white pl-10 pr-3 text-sm text-stone-700 outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
            />
          </form>
        </div>
      </nav>

      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-stone-950/40"
            onClick={() => setShowMobileMenu(false)}
            aria-label="Close menu overlay"
          />
          <div className="absolute bottom-0 right-0 top-0 w-full max-w-sm overflow-y-auto bg-white shadow-xl">
            <div className="space-y-6 p-5 pt-20">
              {user && (
                <div className="rounded-lg border border-stone-200 bg-ivory-50 p-4">
                  <p className="text-sm font-semibold text-stone-900">{user.name}</p>
                  <p className="mt-1 truncate text-xs text-stone-500">{user.email}</p>
                </div>
              )}

              <MobileSection title="Navigation">
                {navLinks.map((link) => (
                  <MobileLink key={link.path} to={link.path} active={isActive(link.path)} label={link.name} />
                ))}
              </MobileSection>

              <MobileSection title="Categories">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.value}
                      to={`/products?category=${category.value}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-stone-700 hover:bg-ivory-100"
                    >
                      <Icon className="h-5 w-5 text-plum-800" />
                      {category.name}
                    </Link>
                  );
                })}
              </MobileSection>

              {user ? (
                <MobileSection title="Account">
                  {user.role === 'admin' && <MobileLink to="/admin" label="Admin Dashboard" />}
                  <MobileLink to="/profile" label="My Profile" />
                  <MobileLink to="/orders" label="My Orders" />
                  <MobileLink to="/addresses" label="My Addresses" />
                  <MobileLink to="/wishlist" label="My Wishlist" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </MobileSection>
              ) : (
                <div className="grid grid-cols-2 gap-3 border-t border-stone-200 pt-5">
                  <Link to="/login" className="rounded-lg border border-stone-200 px-4 py-3 text-center text-sm font-semibold text-stone-700">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-lg bg-plum-900 px-4 py-3 text-center text-sm font-semibold text-white">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DropdownLink({ to, icon, label, close }) {
  return (
    <Link to={to} onClick={close} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-ivory-100">
      {icon({ className: 'h-4 w-4 text-plum-800' })}
      {label}
    </Link>
  );
}

function MobileSection({ title, children }) {
  return (
    <div>
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-normal text-stone-500">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function MobileLink({ to, label, active = false }) {
  return (
    <Link
      to={to}
      className={`block rounded-lg px-3 py-3 text-sm font-semibold ${
        active ? 'bg-ivory-100 text-plum-900' : 'text-stone-700 hover:bg-ivory-100'
      }`}
    >
      {label}
    </Link>
  );
}
