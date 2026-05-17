import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiArrowDown,
  FiArrowUp,
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axios from '../../api/axios';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    totalCustomers: 0,
    customersGrowth: 0,
    conversionRate: 0,
    conversionGrowth: 0,
    recentOrders: [],
  });

  const fetchChartData = useCallback(async () => {
    try {
      const salesRes = await axios.get(`/admin/analytics/sales-chart?range=${timeRange}`);
      setSalesData(salesRes.data || []);
    } catch {
      setSalesData([]);
    }
  }, [timeRange]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes] = await Promise.all([
        axios.get('/admin/orders'),
        axios.get('/admin/users'),
      ]);

      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

      setStats({
        totalRevenue,
        revenueGrowth: 12.5,
        totalOrders: orders.length,
        ordersGrowth: 8.2,
        totalCustomers: customers.length,
        customersGrowth: 15.3,
        conversionRate: 3.2,
        conversionGrowth: 2.1,
        recentOrders: orders.slice(0, 5),
      });
    } catch {
      setStats((current) => ({ ...current, recentOrders: [] }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const metricCards = [
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      delta: stats.revenueGrowth,
      icon: FiDollarSign,
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      delta: stats.ordersGrowth,
      icon: FiShoppingBag,
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      delta: stats.customersGrowth,
      icon: FiUsers,
    },
    {
      title: 'Conversion',
      value: `${stats.conversionRate}%`,
      delta: stats.conversionGrowth,
      icon: FiTrendingUp,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col gap-4 border-b border-stone-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-rose-700">Overview</p>
          <h2 className="mt-2 text-3xl font-semibold text-stone-950">Welcome back, {user?.name || 'Admin'}</h2>
          <p className="mt-2 text-sm text-stone-600">Monitor revenue, orders, customers, and recent activity.</p>
        </div>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="select max-w-48">
          <option value="today">Today</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="year">This year</option>
        </select>
      </div>

      {loading ? (
        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <SkeletonLoader variant="card" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
            <MetricCard key={metric.title} metric={metric} />
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-stone-950">Sales overview</h3>
              <p className="mt-1 text-sm text-stone-500">Revenue trend for the selected period.</p>
            </div>
            <span className="rounded-full bg-ivory-100 px-3 py-1 text-xs font-semibold text-plum-900">Revenue</span>
          </div>

          {salesData.length === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center rounded-lg bg-stone-50 text-stone-400">
              <FiTrendingUp className="mb-3 h-10 w-10" />
              <p className="text-sm">No sales data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a1831" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#4a1831" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ece7df" vertical={false} />
                <XAxis dataKey="date" stroke="#78716c" tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
                <YAxis stroke="#78716c" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px',
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
                  }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4a1831" strokeWidth={2} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-stone-950">Recent orders</h3>
              <p className="mt-1 text-sm text-stone-500">Latest customer activity.</p>
            </div>
            <Link to="/admin/orders" className="text-sm font-semibold text-plum-900 hover:text-plum-950">
              View all
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center rounded-lg bg-stone-50 text-stone-400">
              <FiPackage className="mb-3 h-10 w-10" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="rounded-lg border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-stone-950">#{order.id}</p>
                      <p className="mt-1 text-xs text-stone-500">{order.User?.name || 'Customer'}</p>
                    </div>
                    <p className="text-sm font-semibold text-stone-950">${Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-ivory-100 px-3 py-1 text-xs font-semibold capitalize text-plum-900">
                      {order.orderStatus || 'placed'}
                    </span>
                    <span className="text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;
  const positive = metric.delta >= 0;

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ivory-100 text-plum-900">
          <Icon className="h-5 w-5" />
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
          positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {positive ? <FiArrowUp className="h-3.5 w-3.5" /> : <FiArrowDown className="h-3.5 w-3.5" />}
          {Math.abs(metric.delta)}%
        </span>
      </div>
      <p className="mt-5 text-sm font-medium text-stone-500">{metric.title}</p>
      <p className="mt-1 text-2xl font-semibold text-stone-950">{metric.value}</p>
    </article>
  );
}
