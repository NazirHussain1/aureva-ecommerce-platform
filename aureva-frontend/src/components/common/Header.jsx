import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

export default function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const cartItemsCount = items?.length || 0

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Aureva
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-gray-700 hover:text-pink-600 transition">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-pink-600 transition">Products</Link>
            {user && <Link to="/orders" className="text-gray-700 hover:text-pink-600 transition">My Orders</Link>}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-pink-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-pink-600 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 text-sm">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 transition">My Profile</Link>
                    <Link to="/orders" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600 transition">My Orders</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-purple-600 hover:bg-purple-50 transition font-medium">Admin Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Link to="/auth/login" className="px-3 py-2 text-pink-600 hover:text-pink-700 transition font-medium">Login</Link>
                <Link to="/auth/register" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-medium shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700 hover:text-pink-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <nav className="flex flex-col gap-1 pt-3 text-sm">
              <Link to="/" onClick={() => setShowMobileMenu(false)} className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition">Home</Link>
              <Link to="/products" onClick={() => setShowMobileMenu(false)} className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition">Products</Link>
              {user && <Link to="/orders" onClick={() => setShowMobileMenu(false)} className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition">My Orders</Link>}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
