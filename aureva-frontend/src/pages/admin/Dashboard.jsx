import { useState, useEffect } from 'react';
import Spinner from '../../components/ui/Spinner';

function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    // Simulate fetching stats
    setTimeout(() => {
      setStats({
        totalRevenue: 12450.50,
        totalOrders: 156,
        totalProducts: 48,
        totalCustomers: 234
      });

      setRecentOrders([
        { id: 101, customer: 'Alice', total: 120.5, status: 'Completed' },
        { id: 102, customer: 'Bob', total: 85.0, status: 'Pending' }
      ]);

      setLowStockProducts([
        { id: 1, name: 'Lipstick', stock: 3 },
        { id: 2, name: 'Eyeliner', stock: 2 }
      ]);
    }, 500);
  }, []);

  if (!stats) return <Spinner size="lg" />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💰" bgColor="bg-green-100" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" bgColor="bg-blue-100" />
        <StatCard title="Total Products" value={stats.totalProducts} icon="🛍️" bgColor="bg-purple-100" />
        <StatCard title="Total Customers" value={stats.totalCustomers} icon="👥" bgColor="bg-pink-100" />
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent orders</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${order.total}</p>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Low Stock Products</h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">All products are well stocked</p>
          ) : (
            <ul className="space-y-2">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-800">{product.name}</span>
                  <span className="text-red-600 font-medium">{product.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
