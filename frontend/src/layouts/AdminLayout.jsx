import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiBarChart2,
  FiHome,
  FiLogOut,
  FiMail,
  FiMenu,
  FiPackage,
  FiSettings,
  FiShoppingCart,
  FiTag,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import BrandLogo from '../components/common/BrandLogo';
import UserAvatar from '../components/common/UserAvatar';
import { logout } from '../features/auth/authSlice';

const menuItems = [
  { path: '/admin', icon: MdDashboard, label: 'Dashboard' },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
  { path: '/admin/customers', icon: FiUsers, label: 'Customers' },
  { path: '/admin/coupons', icon: FiTag, label: 'Coupons' },
  { path: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
  { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  { path: '/admin/site-settings', icon: FiSettings, label: 'Site settings' },
  { path: '/admin/contact-messages', icon: FiMail, label: 'Messages' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentPage = menuItems.find((item) => item.path === location.pathname)?.label || 'Admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-stone-900">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} fixed inset-y-0 left-0 z-40 flex flex-col border-r border-stone-800 bg-stone-950 text-stone-300 transition-all duration-300`}>
        <div className="flex h-20 items-center justify-between border-b border-stone-800 px-5">
          {sidebarOpen ? (
            <div className="rounded-lg bg-white px-4 py-2">
              <BrandLogo />
            </div>
          ) : (
            <span className="font-serif text-3xl font-semibold text-white">A</span>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((value) => !value)}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-900 hover:text-white"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  active ? 'bg-white text-stone-950' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-stone-800 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-stone-400 transition hover:bg-stone-900 hover:text-white"
          >
            <FiHome className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Back to store</span>}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-stone-400 transition hover:bg-red-950/40 hover:text-red-200"
          >
            <FiLogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className={`${sidebarOpen ? 'pl-72' : 'pl-20'} min-h-screen transition-all duration-300`}>
        <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">Aureva admin</p>
              <h1 className="mt-1 text-xl font-semibold text-stone-950">{currentPage}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-stone-950">{user?.name}</p>
                <p className="text-xs text-stone-500">Administrator</p>
              </div>
              <UserAvatar user={user} size="md" />
            </div>
          </div>
        </header>

        <main className="admin-workspace min-h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
