import { useState, useEffect } from 'react';
import Spinner from '../../components/ui/Spinner';

const STATUS_COLORS = {
  placed: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching orders from API
    setTimeout(() => {
      setOrders([
        { id: 101, customerName: 'Alice', createdAt: '2026-02-05', totalAmount: 120.5, orderStatus: 'placed' },
        { id: 102, customerName: 'Bob', createdAt: '2026-02-06', totalAmount: 85.0, orderStatus: 'processing' },
        { id: 103, customerName: 'Charlie', createdAt: '2026-02-06', totalAmount: 50.0, orderStatus: 'delivered' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.orderStatus === filter);

  const handleStatusUpdate = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Orders</option>
          {Object.keys(STATUS_COLORS).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h2>
          <p className="text-gray-600">Orders will appear here once customers start placing them</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      {Object.keys(STATUS_COLORS).map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
