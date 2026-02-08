import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiUsers, FiMail, FiCalendar, FiShoppingBag, FiSearch } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdAdminPanelSettings, MdPerson } from 'react-icons/md';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <BiLoaderAlt className="inline-block animate-spin h-16 w-16 text-purple-600" />
          <p className="text-gray-600 mt-4 text-lg">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <FiUsers className="text-purple-600" />
          Customers Management
        </h1>
      </div>

      <div className="mb-6 relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FiUsers className="text-8xl mb-4 mx-auto text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No customers found</h2>
          <p className="text-gray-600">Customers will appear here once they register</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Total Orders
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMail className="text-gray-400" />
                          {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${
                          customer.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {customer.role === 'admin' ? (
                            <MdAdminPanelSettings className="w-4 h-4" />
                          ) : (
                            <MdPerson className="w-4 h-4" />
                          )}
                          {customer.role?.charAt(0).toUpperCase() + customer.role?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCalendar className="text-gray-400" />
                          {new Date(customer.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <FiShoppingBag className="text-purple-600" />
                          {customer.Orders?.length || 0} orders
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <FiUsers className="text-3xl text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
                <p className="text-xs text-gray-600">Total Customers</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <MdPerson className="text-3xl text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">
                  {customers.filter(c => c.role === 'customer').length}
                </p>
                <p className="text-xs text-gray-600">Regular Customers</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                <MdAdminPanelSettings className="text-3xl text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">
                  {customers.filter(c => c.role === 'admin').length}
                </p>
                <p className="text-xs text-gray-600">Administrators</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <FiShoppingBag className="text-3xl text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">
                  {customers.reduce((sum, c) => sum + (c.Orders?.length || 0), 0)}
                </p>
                <p className="text-xs text-gray-600">Total Orders</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
