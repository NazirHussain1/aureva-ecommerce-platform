import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const cartItemsCount = items?.length || 0;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold text-pink-600">
            Aureva Beauty
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-pink-600 transition">
              Products
            </Link>
            {user && (
              <Link to="/orders" className="text-gray-700 hover:text-pink-600 transition">
                Orders
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-700 hover:text-pink-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-700 hover:text-pink-600 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
                  >
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
