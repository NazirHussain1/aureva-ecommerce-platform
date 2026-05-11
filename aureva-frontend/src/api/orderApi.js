import axios from './axios';

export const orderApi = {
  placeOrder: (orderData) => axios.post('/api/orders', orderData),
  getUserOrders: () => axios.get('/api/orders'),
  getOrderById: (id) => axios.get(`/api/orders/${id}`),
  cancelOrder: (id, reason) => axios.put(`/api/orders/${id}/cancel`, { reason }),
  returnOrder: (id, reason) => axios.put(`/api/orders/${id}/return`, { reason }),
};

export default orderApi;