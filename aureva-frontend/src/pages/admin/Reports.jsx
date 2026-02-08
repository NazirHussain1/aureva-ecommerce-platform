import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiCalendar } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdShowChart } from 'react-icons/md';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
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

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
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
        .slice(0, 5);

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
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
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
          <p className="text-gray-600">Comprehensive business insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
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

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Selling Products</h2>
        {analytics.topSellingProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No sales data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Units Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.topSellingProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-gray-700">{product.quantity} units</td>
                    <td className="px-6 py-4 font-bold text-green-600">${product.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
