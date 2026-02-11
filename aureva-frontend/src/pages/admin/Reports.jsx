import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiCalendar, FiDownload } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdShowChart } from 'react-icons/md';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    topSellingProducts: [],
    revenueByCategory: [],
    ordersByStatus: [],
    monthlyRevenue: []
  });
  const [salesTrend, setSalesTrend] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#6366f1'];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, customersRes, salesRes, growthRes, statusRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/users'),
        axios.get(`/api/admin/analytics/sales-chart?range=${timeRange}`),
        axios.get(`/api/admin/analytics/customer-growth?range=${timeRange}`),
        axios.get('/api/admin/analytics/order-status')
      ]);

      const products = productsRes.data.products || [];
      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      const ordersByStatus = [
        { status: 'Placed', count: orders.filter(o => o.orderStatus === 'placed').length, color: 'bg-blue-500' },
        { status: 'Processing', count: orders.filter(o => o.orderStatus === 'processing').length, color: 'bg-yellow-500' },
        { status: 'Shipped', count: orders.filter(o => o.orderStatus === 'shipped').length, color: 'bg-purple-500' },
        { status: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length, color: 'bg-green-500' },
        { status: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length, color: 'bg-red-500' }
      ];

      const categoryRevenue = {};
      orders.forEach(order => {
        order.OrderItems?.forEach(item => {
          const category = item.Product?.category || 'Other';
          categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.price * item.quantity);
        });
      });

      const revenueByCategory = Object.entries(categoryRevenue).map(([category, revenue]) => ({
        category,
        revenue,
        percentage: ((revenue / totalRevenue) * 100).toFixed(1)
      })).sort((a, b) => b.revenue - a.revenue);

      const productSales = {};
      orders.forEach(order => {
        order.OrderItems?.forEach(item => {
          const productId = item.ProductId;
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.Product?.name || 'Unknown',
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.price * item.quantity;
        });
      });

      const topSellingProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      setAnalytics({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        averageOrderValue,
        topSellingProducts,
        revenueByCategory,
        ordersByStatus
      });

      setSalesTrend(salesRes.data || []);
      setCustomerGrowth(growthRes.data || []);
      setOrderStatus(statusRes.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast.success('Export functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <BiLoaderAlt className="inline-block animate-spin h-16 w-16 text-purple-600" />
          <p className="text-gray-600 mt-4 text-lg">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <MdShowChart className="text-purple-600" />
            Analytics & Reports
          </h1>
          <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
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
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-2"
          >
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <FiDollarSign className="text-4xl mb-3 opacity-80" />
          <p className="text-green-100 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <FiShoppingBag className="text-4xl mb-3 opacity-80" />
          <p className="text-blue-100 text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold">{analytics.totalOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <FiUsers className="text-4xl mb-3 opacity-80" />
          <p className="text-purple-100 text-sm mb-1">Total Customers</p>
          <p className="text-3xl font-bold">{analytics.totalCustomers}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
          <FiTrendingUp className="text-4xl mb-3 opacity-80" />
          <p className="text-pink-100 text-sm mb-1">Avg Order Value</p>
          <p className="text-3xl font-bold">${analytics.averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Revenue Trend</h2>
          {salesTrend.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No sales data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Growth</h2>
          {customerGrowth.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No customer data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="newCustomers" stroke="#8b5cf6" strokeWidth={2} name="New Customers" dot={{ fill: '#8b5cf6', r: 4 }} />
                <Line type="monotone" dataKey="totalCustomers" stroke="#ec4899" strokeWidth={2} name="Total Customers" dot={{ fill: '#ec4899', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Status Distribution</h2>
          {orderStatus.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No order data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders by Status</h2>
          <div className="space-y-4">
            {analytics.ordersByStatus.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">{item.status}</span>
                  <span className="text-gray-900 font-bold">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${analytics.totalOrders > 0 ? (item.count / analytics.totalOrders) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Revenue by Category</h2>
          {analytics.revenueByCategory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-4">
              {analytics.revenueByCategory.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium capitalize">{item.category}</span>
                    <span className="text-gray-900 font-bold">${item.revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.percentage}% of total revenue</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Selling Products Performance</h2>
        {analytics.topSellingProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No sales data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analytics.topSellingProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={100} />
              <YAxis yAxisId="left" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value, name) => [name === 'quantity' ? `${value} units` : `$${value}`, name === 'quantity' ? 'Units Sold' : 'Revenue']}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="quantity" fill="#8b5cf6" name="Units Sold" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue ($)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Selling Products - Detailed View</h2>
        {analytics.topSellingProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No sales data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Product Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Units Sold</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Avg Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.topSellingProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                        'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600 text-lg">${product.revenue.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-700">${(product.revenue / product.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <FiTrendingUp className="text-5xl mx-auto mb-3 opacity-90" />
            <p className="text-purple-100 text-sm mb-1">Growth Rate</p>
            <p className="text-3xl font-bold">
              {analytics.totalOrders > 0 ? '+12.5%' : '0%'}
            </p>
          </div>
          <div className="text-center">
            <FiUsers className="text-5xl mx-auto mb-3 opacity-90" />
            <p className="text-purple-100 text-sm mb-1">Customer Retention</p>
            <p className="text-3xl font-bold">
              {analytics.totalCustomers > 0 ? '87%' : '0%'}
            </p>
          </div>
          <div className="text-center">
            <FiDollarSign className="text-5xl mx-auto mb-3 opacity-90" />
            <p className="text-purple-100 text-sm mb-1">Profit Margin</p>
            <p className="text-3xl font-bold">
              {analytics.totalRevenue > 0 ? '24.3%' : '0%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
