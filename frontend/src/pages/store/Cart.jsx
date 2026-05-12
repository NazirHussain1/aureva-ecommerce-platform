import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { MdRemoveShoppingCart } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import EmptyState from '../../components/common/EmptyState';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    document.title = 'Shopping Cart - Aureva Beauty';
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, []);

  const handleUpdateQuantity = (id, newQuantity, stock) => {
    if (newQuantity > 0) {
      if (newQuantity > stock) {
        toast.error(`Only ${stock} items available in stock`);
        return;
      }
      dispatch(updateQuantity({ productId: id, quantity: newQuantity }));
    }
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 py-16 mt-20">
          <EmptyState
            icon={MdRemoveShoppingCart}
            title="Your cart is empty"
            message="Looks like you haven't added any items to your cart yet. Start shopping and discover amazing beauty products!"
            actionText="Start Shopping"
            actionLink="/products"
            variant="cart"
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg">
              {items.map((item) => (
                <div key={item.id} className="p-6 border-b last:border-b-0">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <HiSparkles className="text-3xl" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 capitalize">{item.category}</p>
                      <p className="text-purple-600 font-bold text-xl">${item.price.toFixed(2)}</p>
                      {item.stock && (
                        <p className={`text-xs mt-1 ${item.stock < 10 ? 'text-red-600' : 'text-gray-500'}`}>
                          {item.stock < 10 ? `Only ${item.stock} left in stock!` : `${item.stock} in stock`}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 active:scale-95 transition touch-target"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Remove
                      </button>

                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.stock)}
                          className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center active:scale-95 transition touch-target"
                          disabled={item.quantity === 1}
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.stock)}
                          className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center active:scale-95 transition touch-target"
                          disabled={item.quantity >= item.stock}
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="mt-2 font-bold text-gray-800 text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="line-clamp-1">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-2xl pt-3 border-t">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl hover:from-pink-700 hover:to-purple-700 transition font-semibold text-lg shadow-lg active:scale-95 touch-target"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
