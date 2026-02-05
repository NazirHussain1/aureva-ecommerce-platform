import { useEffect, useState } from 'react';
import StatsCard from '../../components/admin/StatsCard';
import { formatPrice } from '../../utils/formatters';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 45230,
    totalOrders: 156,
    totalCustomers: 89,
    totalProducts: 234,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          trend="up"
          trendValue="12%"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          trend="up"
          trendValue="8%"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          trend="up"
          trendValue="5%"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Order #{1000 + i}</p>
                  <p className="text-sm text-gray-600">Customer Name</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(Math.random() * 200 + 50)}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Processing</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Low Stock Products</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Product Name {i}</p>
                  <p className="text-sm text-gray-600">SKU: PRD{1000 + i}</p>
                </div>
                <span className="text-orange-600 font-medium">{Math.floor(Math.random() * 5 + 1)} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
