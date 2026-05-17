import { Link, useLocation } from 'react-router-dom';
import { FiHeart, FiMapPin, FiPackage, FiUser } from 'react-icons/fi';
import Footer from './Footer';
import Navbar from './Navbar';
import UserAvatar from './UserAvatar';

const accountLinks = [
  { label: 'Profile', to: '/profile', icon: FiUser },
  { label: 'Orders', to: '/orders', icon: FiPackage },
  { label: 'Addresses', to: '/addresses', icon: FiMapPin },
  { label: 'Wishlist', to: '/wishlist', icon: FiHeart },
];

export default function AccountLayout({ user, title, subtitle, action, children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ivory-50">
      <Navbar />
      <main className="container-custom mt-20 py-8 lg:py-10">
        <div className="mb-8 flex flex-col gap-4 border-b border-stone-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-rose-700">My account</p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-950 lg:text-4xl">{title}</h1>
            {subtitle && <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{subtitle}</p>}
          </div>
          {action}
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
              <UserAvatar user={user} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-950">{user?.name}</p>
                <p className="truncate text-xs text-stone-500">{user?.email}</p>
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              {accountLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                      active ? 'bg-ivory-100 text-plum-900' : 'text-stone-600 hover:bg-stone-50 hover:text-plum-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section>{children}</section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
