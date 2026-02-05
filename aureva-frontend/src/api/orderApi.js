import axios from './axios';

export const orderApi = {
  placeOrder: (orderData) => axios.post('/orders', orderData),
  getUserOrders: () => axios.get('/orders'),
  getOrderById: (id) => axios.get(`/orders/${id}`),
  cancelOrder: (id, reason) => axios.put(`/orders/${id}/cancel`, { reason }),
  returnOrder: (id, reason) => axios.put(`/orders/${id}/return`, { reason }),
};

export default orderApi;