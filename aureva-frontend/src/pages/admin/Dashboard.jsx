import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdInventory, MdShoppingCart, MdPeople, MdAttachMoney } from 'react-icons/md';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockProducts: 0,
    recentOrders: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/users')
      ]);

      const products = productsRes.data.products || [];
      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
      const pendingOrders = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'processing').length;
      const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;
      const lowStockProducts = products.filter(p => p.stock < 10).length;
      const recentOrders = orders.slice(0, 5);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalRevenue,
        pendingOrders,
        completedOrders,
        lowStockProducts,
        recentOrders
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <BiLoaderAlt className="inline-block animate-spin h-16 w-16 text-purple-600" />
          <p className="text-gray-600 mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Products', 
      value: stats.totalProducts, 
      icon: MdInventory, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      icon: MdShoppingCart, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      title: 'Total Customers', 
      value: stats.totalCustomers, 
      icon: MdPeople, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      title: 'Total Revenue', 
      value: `$${stats.totalRevenue.toFixed(2)}`, 
      icon: MdAttachMoney, 
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
  ];

  const quickStats = [
    { title: 'Pending Orders', value: stats.pendingOrders, icon: FiClock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Completed Orders', value: stats.completedOrders, icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Low Stock Items', value: stats.lowStockProducts, icon: FiAlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const quickLinks = [
    { title: 'Manage Products', path: '/admin/products', icon: FiPackage, desc: 'Add, edit, delete products', color: 'text-blue-600' },
    { title: 'View Orders', path: '/admin/orders', icon: FiShoppingBag, desc: 'Manage customer orders', color: 'text-green-600' },
    { title: 'Customers', path: '/admin/customers', icon: FiUsers, desc: 'View customer list', color: 'text-purple-600' },
    { title: 'Reports', path: '/admin/reports', icon: FiTrendingUp, desc: 'View analytics', color: 'text-pink-600' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome back, {user?.name}! 👋</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <IconComponent className={`text-3xl ${stat.textColor}`} />
                </div>
                <FiTrendingUp className="text-green-500 text-xl" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`${stat.bg} rounded-2xl p-6 border-2 border-transparent hover:border-gray-300 transition`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <IconComponent className={`text-2xl ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiShoppingBag className="text-purple-600" />
            Recent Orders
          </h2>
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                      #{order.id}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{order.User?.name || 'Customer'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${Number(order.totalAmount).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link
            to="/admin/orders"
            className="block mt-6 text-center text-purple-600 hover:text-purple-700 font-semibold"
          >
            View All Orders →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition group"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-purple-50 transition">
                    <IconComponent className={`text-2xl ${link.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition">
                      {link.title}
                    </h3>
                    <p className="text-xs text-gray-600">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {stats.totalProducts === 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">🚀 Get Started</h2>
          <p className="text-lg mb-6 text-purple-100">Add your first product to start selling!</p>
          <Link
            to="/admin/products"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Add Product
          </Link>
        </div>
      )}
    </div>
  );
}
