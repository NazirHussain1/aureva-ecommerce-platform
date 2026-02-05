import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';
import { calculateCartTotal } from '../utils/helpers';

export default function useCart() {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.cart);

  const cartTotal = calculateCartTotal(items);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  const addItem = (product, quantity = 1) => {
    dispatch(addToCart({ product, quantity }));
  };

  const removeItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const updateItemQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const clearAllItems = () => {
    dispatch(clearCart());
  };

  return {
    items,
    isLoading,
    cartTotal,
    cartCount,
    addItem,
    removeItem,
    updateItemQuantity,
    clearAllItems,
  };
}
