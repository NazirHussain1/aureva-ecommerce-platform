import { Outlet, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function AdminLayout() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <Link to="/admin" className="text-2xl font-bold text-purple-600">
              Aureva Admin
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin"
                  className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products"
                  className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/orders"
                  className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/customers"
                  className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition"
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/coupons"
                  className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition"
                >
                  Coupons
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/reports"
                  className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition"
                >
                  Reports
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
