import { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import { formatDate } from '../../utils/formatters';

export default function Customers() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', createdAt: new Date('2024-01-15') },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', createdAt: new Date('2024-02-20') },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', createdAt: new Date('2024-03-10') },
  ]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Joined', render: (value) => formatDate(value) },
  ];

  const handleEdit = (customer) => {
    console.log('Edit customer:', customer);
  };

  const handleDelete = (customer) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter((c) => c.id !== customer.id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Total Customers</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">New This Month</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Active Users</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={customers} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
