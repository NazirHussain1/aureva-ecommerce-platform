import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiEye, FiX, FiUser, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { MdShoppingCart, MdLocalShipping, MdCheckCircle as MdCheck, MdCancel } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/orders');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await axios.put(`/api/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, orderStatus: newStatus } : prev
      );
      
      toast.success('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      placed: { text: 'Pending', class: 'bg-yellow-100 text-yellow-700', icon: FiClock },
      processing: { text: 'Processing', class: 'bg-blue-100 text-blue-700', icon: FiPackage },
      shipped: { text: 'Shipped', class: 'bg-purple-100 text-purple-700', icon: FiTruck },
      delivered: { text: 'Delivered', class: 'bg-green-100 text-green-700', icon: FiCheckCircle },
      cancelled: { text: 'Cancelled', class: 'bg-red-100 text-red-700', icon: FiXCircle },
      returned: { text: 'Returned', class: 'bg-gray-100 text-gray-700', icon: FiXCircle }
    };
    return badges[status] || badges.placed;
  };

  const stats = {
    pending: orders.filter(o => o.orderStatus === 'placed').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Orders Management</h1>
        <p className="text-gray-600">{filteredOrders.length} total orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slideInUp">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <FiClock className="text-2xl text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.pending}</span>
          </div>
          <p className="text-sm font-semibold text-gray-600">Pending Orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <FiTruck className="text-2xl text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.shipped}</span>
          </div>
          <p className="text-sm font-semibold text-gray-600">Shipped Orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="text-2xl text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.delivered}</span>
          </div>
          <p className="text-sm font-semibold text-gray-600">Delivered Orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <FiXCircle className="text-2xl text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.cancelled}</span>
          </div>
          <p className="text-sm font-semibold text-gray-600">Cancelled Orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6 animate-fadeIn">
        <div className="flex flex-wrap gap-3">
          {['all', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                filter === status
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonLoader key={i} variant="card" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {filter !== 'all' ? `No ${filter} orders at the moment` : 'No orders have been placed yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedOrders.map((order) => {
                    const badge = getStatusBadge(order.orderStatus);
                    const StatusIcon = badge.icon;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              #{order.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{order.User?.name || 'Customer'}</p>
                            <p className="text-sm text-gray-500">{order.User?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">${Number(order.totalAmount).toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${badge.class}`}>
                            <StatusIcon className="w-4 h-4" />
                            {badge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium text-sm flex items-center gap-1"
                            >
                              <FiEye className="w-4 h-4" />
                              View
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
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-modalFadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-t-3xl relative">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <FiX className="text-2xl" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiPackage className="text-2xl" />
                </div>
                <h2 className="text-3xl font-bold">Order #{selectedOrder.id}</h2>
              </div>
              <p className="text-purple-100">
                Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiUser className="text-purple-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">Name: <span className="font-semibold text-gray-900">{selectedOrder.User?.name || 'N/A'}</span></p>
                    <p className="text-gray-600">Email: <span className="font-semibold text-gray-900">{selectedOrder.User?.email || 'N/A'}</span></p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiMapPin className="text-purple-600" />
                    Shipping Address
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-semibold">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                    <p className="text-gray-600">{selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiPackage className="text-purple-600" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.OrderItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.Product?.images && item.Product.images[0] ? (
                          <img src={item.Product.images[0]} alt={item.Product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HiSparkles className="text-2xl text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.Product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                      </div>
                      <p className="font-bold text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FiDollarSign className="text-purple-600" />
                    Payment Details
                  </h3>
                  <span className="px-3 py-1 bg-white rounded-lg text-sm font-semibold text-gray-700 capitalize">
                    {selectedOrder.paymentMethod?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-purple-200">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ${Number(selectedOrder.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Update Order Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                    const badge = getStatusBadge(status);
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                        disabled={updating === selectedOrder.id || selectedOrder.orderStatus === status}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          selectedOrder.orderStatus === status
                            ? `${badge.class} cursor-default`
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50 disabled:opacity-50'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
