import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export default function useCart() {
  const { items, total } = useSelector((state) => state.cart);

  const cartCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const isEmpty = items.length === 0;

  const hasItem = (productId) => {
    return items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return {
    items,
    total,
    cartCount,
    isEmpty,
    hasItem,
    getItemQuantity,
  };
}
