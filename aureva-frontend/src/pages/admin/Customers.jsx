import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiSearch, FiEye, FiUserX, FiUsers, FiUserPlus, FiUserCheck, FiMail, FiShoppingBag } from 'react-icons/fi';
import { MdPeople, MdPersonAdd, MdVerifiedUser } from 'react-icons/md';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const normalizeStatus = (status) => (status === 'blocked' ? 'blocked' : 'active');

  const handleBlockUser = (userId, currentStatus) => {
    const normalizedStatus = normalizeStatus(currentStatus);
    const nextStatus = normalizedStatus === 'active' ? 'blocked' : 'active';
    const action = nextStatus === 'blocked' ? 'block' : 'unblock';

    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-800">
          Are you sure you want to {action} this user?
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.put(`/api/admin/users/${userId}/status`, {
                  status: nextStatus,
                });
                toast.success(`User ${action}ed successfully!`);
                fetchCustomers();
              } catch (error) {
                console.error('Error updating user status:', error);
                toast.error(`Failed to ${action} user`);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors ${
              nextStatus === 'blocked'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
    });
  };

  const filteredCustomers = customers.filter(customer => {
    const normalizedStatus = normalizeStatus(customer.status);
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && normalizedStatus === 'active') ||
      (filterStatus === 'blocked' && normalizedStatus === 'blocked');
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: customers.length,
    newThisMonth: customers.filter(c => {
      const createdDate = new Date(c.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length,
    active: customers.filter(c => normalizeStatus(c.status) === 'active').length
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCustomerBadge = (customer) => {
    const orderCount = customer.Orders?.length || 0;
    if (orderCount >= 10) return { text: 'VIP', class: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' };
    if (orderCount >= 5) return { text: 'Regular', class: 'bg-blue-100 text-blue-700' };
    return { text: 'New', class: 'bg-gray-100 text-gray-700' };
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Customers</h1>
        <p className="text-gray-600">{filteredCustomers.length} total customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slideInUp">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <MdPeople className="text-2xl text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <p className="text-sm font-semibold text-gray-600">Total Customers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <MdPersonAdd className="text-2xl text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</span>
          </div>
          <p className="text-sm font-semibold text-gray-600">New This Month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <MdVerifiedUser className="text-2xl text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.active}</span>
          </div>
          <p className="text-sm font-semibold text-gray-600">Active Users</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 font-medium"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonLoader key={i} variant="card" />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20">
            <FiUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Customers Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'No customers registered yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedCustomers.map((customer) => {
                    const normalizedStatus = normalizeStatus(customer.status);
                    const badge = getCustomerBadge(customer);
                    const orderCount = customer.Orders?.length || 0;
                    const totalSpent = customer.Orders?.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0) || 0;
                    
                    return (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {getInitials(customer.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{customer.name}</p>
                              <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${badge.class}`}>
                                {badge.text}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiMail className="text-gray-400" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiShoppingBag className="text-purple-600" />
                            <span className="font-semibold text-gray-900">{orderCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            normalizedStatus === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {normalizedStatus === 'active' ? 'Active' : 'Blocked'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleBlockUser(customer.id, normalizedStatus)}
                              className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center gap-1 ${
                                normalizedStatus === 'active'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {normalizedStatus === 'active' ? (
                                <>
                                  <FiUserX className="w-4 h-4" />
                                  Block
                                </>
                              ) : (
                                <>
                                  <FiUserCheck className="w-4 h-4" />
                                  Unblock
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
