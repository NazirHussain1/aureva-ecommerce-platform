import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiArrowUp, FiArrowDown, FiPackage, FiEye } from 'react-icons/fi';
import { MdAttachMoney, MdShoppingCart, MdPeople, MdTrendingUp } from 'react-icons/md';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    totalCustomers: 0,
    customersGrowth: 0,
    conversionRate: 0,
    conversionGrowth: 0,
    recentOrders: []
  });
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const fetchChartData = async () => {
    try {
      const salesRes = await axios.get(`/api/admin/analytics/sales-chart?range=${timeRange}`);
      setSalesData(salesRes.data || []);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes] = await Promise.all([
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/users')
      ]);

      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
      const recentOrders = orders.slice(0, 5);

      setStats({
        totalRevenue,
        revenueGrowth: 12.5,
        totalOrders: orders.length,
        ordersGrowth: 8.2,
        totalCustomers: customers.length,
        customersGrowth: 15.3,
        conversionRate: 3.2,
        conversionGrowth: 2.1,
        recentOrders
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      growth: stats.revenueGrowth,
      icon: MdAttachMoney,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      growth: stats.ordersGrowth,
      icon: MdShoppingCart,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      growth: stats.customersGrowth,
      icon: MdPeople,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      growth: stats.conversionGrowth,
      icon: MdTrendingUp,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 font-medium text-gray-700"
        >
          <option value="today">Today</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-shimmer"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-lg animate-shimmer"></div>
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-shimmer mb-2"></div>
              <div className="h-8 w-32 bg-gray-200 rounded animate-shimmer"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideInUp">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            const isPositive = stat.growth >= 0;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`text-2xl ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold ${
                    isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {isPositive ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />}
                    {Math.abs(stat.growth)}%
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              Revenue
            </div>
          </div>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <SkeletonLoader variant="card" />
            </div>
          ) : salesData.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-gray-400">
              <FiTrendingUp className="text-6xl mb-3" />
              <p>No sales data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af" 
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  labelStyle={{ fontWeight: '600', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonLoader key={i} variant="card" />
              ))}
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-gray-400">
              <FiShoppingBag className="text-6xl mb-3" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      #{order.id}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{order.User?.name || 'Customer'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">${Number(order.totalAmount).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.orderStatus === 'processing' ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
              <Link
                to="/admin/orders"
                className="block mt-4 text-center text-purple-600 hover:text-purple-700 font-semibold text-sm py-2 hover:bg-purple-50 rounded-lg transition-colors duration-300"
              >
                View All Orders →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
