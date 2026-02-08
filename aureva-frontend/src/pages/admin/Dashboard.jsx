import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { title: 'Total Products', value: '0', icon: '📦', color: 'from-blue-500 to-blue-600' },
    { title: 'Total Orders', value: '0', icon: '🛒', color: 'from-green-500 to-green-600' },
    { title: 'Total Customers', value: '0', icon: '👥', color: 'from-purple-500 to-purple-600' },
    { title: 'Total Revenue', value: '$0', icon: '💰', color: 'from-pink-500 to-pink-600' },
  ];

  const quickLinks = [
    { title: 'Manage Products', path: '/admin/products', icon: '📦', desc: 'Add, edit, delete products' },
    { title: 'View Orders', path: '/admin/orders', icon: '🛒', desc: 'Manage customer orders' },
    { title: 'Customers', path: '/admin/customers', icon: '👥', desc: 'View customer list' },
    { title: 'Reports', path: '/admin/reports', icon: '📊', desc: 'View analytics' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! 👋</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition group"
            >
              <div className="text-4xl mb-3">{link.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">🚀 Get Started</h2>
        <p className="mb-4">Add your first product to start selling!</p>
        <Link
          to="/admin/products"
          className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Add Product
        </Link>
      </div>
    </div>
  );
}
