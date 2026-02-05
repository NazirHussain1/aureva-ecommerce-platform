import { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import { formatPrice, formatDate } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';

export default function Orders() {
  const [orders, setOrders] = useState([
    { id: 1001, customerName: 'John Doe', totalAmount: 125.99, orderStatus: 'processing', createdAt: new Date() },
    { id: 1002, customerName: 'Jane Smith', totalAmount: 89.50, orderStatus: 'shipped', createdAt: new Date() },
    { id: 1003, customerName: 'Bob Johnson', totalAmount: 210.00, orderStatus: 'delivered', createdAt: new Date() },
  ]);

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customerName', label: 'Customer' },
    { key: 'totalAmount', label: 'Amount', render: (value) => formatPrice(value) },
    {
      key: 'orderStatus',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'delivered' ? 'bg-green-100 text-green-800' :
          value === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {ORDER_STATUS[value]}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Date', render: (value) => formatDate(value) },
  ];

  const handleEdit = (order) => {
    console.log('Edit order:', order);
  };

  const handleDelete = (order) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter((o) => o.id !== order.id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Processing</p>
          <p className="text-2xl font-bold">{orders.filter((o) => o.orderStatus === 'processing').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Shipped</p>
          <p className="text-2xl font-bold">{orders.filter((o) => o.orderStatus === 'shipped').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Delivered</p>
          <p className="text-2xl font-bold">{orders.filter((o) => o.orderStatus === 'delivered').length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={orders} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
