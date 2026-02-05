import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../features/orders/orderSlice';
import { formatPrice, formatDate } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';
import Spinner from '../../components/ui/Spinner';

export default function Orders() {
  const dispatch = useDispatch();
  const { items: orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="container-custom py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
        <p className="text-gray-600">Start shopping to see your orders here</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {ORDER_STATUS[order.orderStatus]}
              </span>
            </div>

            <div className="border-t pt-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 mb-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <p className="text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-pink-600">{formatPrice(order.totalAmount)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
