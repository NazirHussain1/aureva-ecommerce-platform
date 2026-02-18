import { useState, useEffect, useCallback } from 'react';
import axios from '../../api/axios';
import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiUsers, FiDownload } from 'react-icons/fi';
import { MdAttachMoney, MdShoppingCart, MdPeople, MdTrendingUp } from 'react-icons/md';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);

  const fetchReportsData = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes, salesRes] = await Promise.all([
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/users'),
        axios.get(`/api/admin/analytics/sales-chart?range=${timeRange}`)
      ]);

      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];
      const salesData = salesRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        avgOrderValue
      });

      setRevenueData(salesData);

      const statusCounts = orders.reduce((acc, order) => {
        const status = order.orderStatus || 'placed';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      setOrderStatusData([
        { name: 'Pending', value: statusCounts.placed || 0, color: '#fbbf24' },
        { name: 'Processing', value: statusCounts.processing || 0, color: '#3b82f6' },
        { name: 'Shipped', value: statusCounts.shipped || 0, color: '#a855f7' },
        { name: 'Delivered', value: statusCounts.delivered || 0, color: '#10b981' },
        { name: 'Cancelled', value: statusCounts.cancelled || 0, color: '#ef4444' }
      ]);

      const mockCategoryData = [
        { category: 'Skincare', sales: 45000 },
        { category: 'Makeup', sales: 38000 },
        { category: 'Haircare', sales: 32000 },
        { category: 'Fragrance', sales: 28000 },
        { category: 'Wellness', sales: 22000 }
      ];
      setCategoryData(mockCategoryData);

    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: MdAttachMoney,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: MdShoppingCart,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: MdPeople,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Avg Order Value',
      value: `$${stats.avgOrderValue.toFixed(2)}`,
      icon: MdTrendingUp,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics & Reports</h1>
          <p className="text-gray-600">Track your business performance</p>
        </div>
        <div className="flex items-center gap-3">
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
          <button className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2">
            <FiDownload className="text-lg" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-shimmer"></div>
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
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`text-2xl ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h2>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <SkeletonLoader variant="card" />
            </div>
          ) : revenueData.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-gray-400">
              <FiTrendingUp className="text-6xl mb-3" />
              <p>No revenue data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={revenueData}>
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
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sales by Category</h2>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <SkeletonLoader variant="card" />
            </div>
          ) : categoryData.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-gray-400">
              <FiShoppingBag className="text-6xl mb-3" />
              <p>No category data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="category" 
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
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  formatter={(value) => [`${value}`, 'Sales']}
                  labelStyle={{ fontWeight: '600', marginBottom: '4px' }}
                />
                <Bar dataKey="sales" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status Distribution</h2>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <SkeletonLoader variant="card" />
          </div>
        ) : orderStatusData.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-gray-400">
            <FiShoppingBag className="text-6xl mb-3" />
            <p>No order data available</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {orderStatusData.map((status, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {status.name}: {status.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
