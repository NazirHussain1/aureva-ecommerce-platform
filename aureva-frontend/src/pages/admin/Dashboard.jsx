import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdInventory, MdShoppingCart, MdPeople, MdAttachMoney } from 'react-icons/md';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
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
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [dailySales, setDailySales] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [repeatCustomers, setRepeatCustomers] = useState(null);

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#6366f1'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const fetchChartData = async () => {
    try {
      const [salesRes, categoryRes, topProductsRes, dailySalesRes, monthlyRevenueRes, repeatCustomersRes] = await Promise.all([
        axios.get(`/api/admin/analytics/sales-chart?range=${timeRange}`),
        axios.get('/api/admin/analytics/category-revenue'),
        axios.get('/api/admin/analytics/top-products?limit=5'),
        axios.get('/api/admin/analytics/daily-sales'),
        axios.get('/api/admin/analytics/monthly-revenue'),
        axios.get('/api/admin/analytics/repeat-customers')
      ]);

      setSalesData(salesRes.data || []);
      setCategoryData(categoryRes.data || []);
      setTopProducts(topProductsRes.data || []);
      setDailySales(dailySalesRes.data || null);
      setMonthlyRevenue(monthlyRevenueRes.data || null);
      setRepeatCustomers(repeatCustomersRes.data || null);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back, {user?.name}! 👋</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">Daily Sales</p>
              <p className="text-3xl font-bold">${dailySales?.totalSales || 0}</p>
            </div>
            <FiDollarSign className="text-4xl opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-1 rounded-full ${
              dailySales?.growthPercentage >= 0 ? 'bg-green-400' : 'bg-red-400'
            } text-white font-semibold`}>
              {dailySales?.growthPercentage >= 0 ? '+' : ''}{dailySales?.growthPercentage || 0}%
            </span>
            <span className="text-blue-100">vs yesterday</span>
          </div>
          <p className="text-xs text-blue-100 mt-2">{dailySales?.totalOrders || 0} orders today</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-green-100 text-sm mb-1">Monthly Revenue</p>
              <p className="text-3xl font-bold">${monthlyRevenue?.totalRevenue || 0}</p>
            </div>
            <FiTrendingUp className="text-4xl opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-1 rounded-full ${
              monthlyRevenue?.growthPercentage >= 0 ? 'bg-green-400' : 'bg-red-400'
            } text-white font-semibold`}>
              {monthlyRevenue?.growthPercentage >= 0 ? '+' : ''}{monthlyRevenue?.growthPercentage || 0}%
            </span>
            <span className="text-green-100">vs last month</span>
          </div>
          <p className="text-xs text-green-100 mt-2">{monthlyRevenue?.monthName || 'Current Month'}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-purple-100 text-sm mb-1">Top Product Sales</p>
              <p className="text-3xl font-bold">{topProducts[0]?.quantity || 0}</p>
            </div>
            <FiPackage className="text-4xl opacity-80" />
          </div>
          <p className="text-sm text-purple-100 truncate">{topProducts[0]?.name || 'No sales yet'}</p>
          <p className="text-xs text-purple-100 mt-2">Revenue: ${topProducts[0]?.revenue?.toFixed(2) || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-pink-100 text-sm mb-1">Repeat Customers</p>
              <p className="text-3xl font-bold">{repeatCustomers?.repeatCustomerPercentage || 0}%</p>
            </div>
            <FiUsers className="text-4xl opacity-80" />
          </div>
          <p className="text-sm text-pink-100">{repeatCustomers?.repeatCustomers || 0} of {repeatCustomers?.totalCustomers || 0} customers</p>
          <p className="text-xs text-pink-100 mt-2">Customer loyalty metric</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Trend</h2>
          {salesData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No sales data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Revenue by Category</h2>
          {categoryData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No category data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Selling Products</h2>
          {topProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No product data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value, name) => [name === 'quantity' ? `${value} units` : `$${value}`, name === 'quantity' ? 'Units Sold' : 'Revenue']}
                />
                <Legend />
                <Bar dataKey="quantity" fill="#8b5cf6" name="Units Sold" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#ec4899" name="Revenue" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Volume</h2>
          {salesData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No order data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`${value} orders`, 'Orders']}
                />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Revenue Breakdown</h2>
          {monthlyRevenue?.dailyBreakdown?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No revenue data for this month</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue?.dailyBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value, name) => [name === 'revenue' ? `$${value}` : value, name === 'revenue' ? 'Revenue' : 'Orders']}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="orders" fill="#3b82f6" name="Orders" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
              <p className="text-lg font-bold text-green-600">${monthlyRevenue?.totalRevenue || 0}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Total Orders</p>
              <p className="text-lg font-bold text-blue-600">{monthlyRevenue?.totalOrders || 0}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Avg Order</p>
              <p className="text-lg font-bold text-purple-600">${monthlyRevenue?.averageOrderValue || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Loyalty Analysis</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Repeat Customers</p>
              <p className="text-4xl font-bold text-purple-600">{repeatCustomers?.repeatCustomerPercentage || 0}%</p>
              <p className="text-xs text-gray-500 mt-1">{repeatCustomers?.repeatCustomers || 0} customers</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">One-Time Buyers</p>
              <p className="text-4xl font-bold text-blue-600">
                {repeatCustomers?.totalCustomers > 0 
                  ? ((repeatCustomers.oneTimeCustomers / repeatCustomers.totalCustomers) * 100).toFixed(1)
                  : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{repeatCustomers?.oneTimeCustomers || 0} customers</p>
            </div>
          </div>
          {repeatCustomers?.orderFrequency?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Frequency Distribution</h3>
              <div className="space-y-2">
                {repeatCustomers.orderFrequency.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.range}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ 
                            width: `${(item.count / repeatCustomers.repeatCustomers) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
