export const CATEGORIES = [
  { value: 'skincare', label: 'Skincare' },
  { value: 'haircare', label: 'Haircare' },
  { value: 'makeup', label: 'Makeup' },
  { value: 'fragrance', label: 'Fragrance' },
  { value: 'personal wellness', label: 'Personal Wellness' },
  { value: 'beauty accessories', label: 'Beauty Accessories' },
];

export const ORDER_STATUS = {
  placed: 'Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
];

export const API_BASE_URL = 'http://localhost:5000/api';
