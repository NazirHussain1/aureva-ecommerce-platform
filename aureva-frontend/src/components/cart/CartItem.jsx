import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../features/cart/cartSlice';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl } from '../../utils/helpers';

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId: item.id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <img
        src={getImageUrl(item.images?.[0] || item.image)}
        alt={item.name}
        className="w-24 h-24 object-cover rounded"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-gray-600 text-sm">{item.category}</p>
        <p className="text-pink-600 font-bold mt-1">{formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-12 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-700 text-sm mt-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
