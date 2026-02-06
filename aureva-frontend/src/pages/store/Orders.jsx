import { useState, useEffect } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example mock data
  const mockOrders = [
    {
      id: '1001',
      createdAt: '2026-02-07T08:30:00Z',
      orderStatus: 'placed',
      totalAmount: 120.99,
      items: [
        { id: 'p1', name: 'Hydrating Face Serum', quantity: 1, price: 45.99, image: '' },
        { id: 'p2', name: 'Luxury Lipstick', quantity: 2, price: 37.50, image: '' },
      ],
    },
    {
      id: '1002',
      createdAt: '2026-02-05T12:15:00Z',
      orderStatus: 'shipped',
      totalAmount: 89.0,
      items: [
        { id: 'p3', name: 'Aloe Vera Gel', quantity: 2, price: 44.5, image: '' },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchOrders = async () => {
      setLoading(true);
      setTimeout(() => {
        setOrders(mockOrders); // Replace with real API call
        setLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <a
            href="/products"
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition inline-block"
          >
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>

              <div className="border-t pt-4 space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">🧴</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-pink-600">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
