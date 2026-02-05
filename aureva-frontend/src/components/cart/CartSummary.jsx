import { formatPrice } from '../../utils/formatters';
import Button from '../ui/Button';

export default function CartSummary({ subtotal, onCheckout }) {
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-pink-600">{formatPrice(total)}</span>
        </div>
      </div>

      {subtotal < 50 && (
        <p className="text-sm text-gray-600 mb-4">
          Add {formatPrice(50 - subtotal)} more for free shipping!
        </p>
      )}

      <Button onClick={onCheckout} className="w-full">
        Proceed to Checkout
      </Button>
    </div>
  );
}
