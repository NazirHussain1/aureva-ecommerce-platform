import { useState, useEffect } from 'react';
import Spinner from '../../components/ui/Spinner';

function CustomerRow({ customer }) {
  return (
    <tr>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{customer.orderCount}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">${customer.totalSpent}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {new Date(customer.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm">
        <button className="text-blue-600 hover:text-blue-800">View</button>
      </td>
    </tr>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching customer data
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customers Management</h1>

      {loading ? (
        <Spinner size="lg" />
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No customers yet</h2>
          <p className="text-gray-600">Customer information will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <CustomerRow key={customer.id} customer={customer} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
