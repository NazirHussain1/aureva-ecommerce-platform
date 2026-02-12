import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiEye } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import { MdShoppingBag } from 'react-icons/md';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    document.title = 'My Orders - Aureva Beauty';
    fetchOrders();
    
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      placed: <FiClock className="text-lg" />,
      processing: <FiPackage className="text-lg" />,
      shipped: <FiTruck className="text-lg" />,
      delivered: <FiCheckCircle className="text-lg" />,
      cancelled: <FiXCircle className="text-lg" />,
      returned: <FiXCircle className="text-lg" />,
    };
    return icons[status] || <FiPackage className="text-lg" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-100 text-blue-700 border-blue-200',
      processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      returned: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
          <div className="mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded-xl animate-shimmer mb-2"></div>
            <div className="h-6 w-64 bg-gray-200 rounded-xl animate-shimmer"></div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-2">
                    <div className="h-6 w-32 bg-gray-200 rounded-xl animate-shimmer"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded-xl animate-shimmer"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded-full animate-shimmer"></div>
                </div>
                <div className="space-y-4">
                  <SkeletonLoader variant="card" />
                  <SkeletonLoader variant="card" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
          <EmptyState
            icon={MdShoppingBag}
            title="No Orders Yet"
            message="Start shopping to see your orders here. Browse our collection of premium beauty products."
            actionText="Browse Products"
            actionOnClick={() => navigate('/products')}
            variant="orders"
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="space-y-6 animate-slideInUp">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FiPackage className="text-2xl text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border-2 ${getStatusColor(order.orderStatus)}`}>
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                {order.OrderItems?.map((orderItem) => (
                  <div key={orderItem.id} className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
                      {orderItem.Product?.images && orderItem.Product.images[0] ? (
                        <img 
                          src={orderItem.Product.images[0]} 
                          alt={orderItem.Product.name} 
                          loading="lazy"
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <HiSparkles className="text-3xl text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 mb-1 truncate">{orderItem.Product?.name || 'Product'}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">Qty: <span className="font-semibold text-gray-900">{orderItem.quantity}</span></span>
                        <span className="text-purple-600 font-semibold">${Number(orderItem.price).toFixed(2)} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        ${(orderItem.price * orderItem.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Payment Method</span>
                    <span className="font-semibold text-gray-900 capitalize px-3 py-1 bg-gray-100 rounded-lg">
                      {order.paymentMethod?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 touch-target"
                  >
                    <FiEye className="text-lg" />
                    View Details
                  </button>
                  {order.orderStatus === 'delivered' && (
                    <button
                      className="flex-1 sm:flex-none px-6 py-3 bg-white text-purple-600 font-bold rounded-xl border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300 active:scale-95 touch-target"
                    >
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
