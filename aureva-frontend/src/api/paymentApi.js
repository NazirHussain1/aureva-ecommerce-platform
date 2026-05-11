import axios from './axios';

export const paymentApi = {
  processPayment: (paymentData) => axios.post('/api/payments/process', paymentData),
  getPaymentHistory: () => axios.get('/api/payments/history'),
  getPaymentDetails: (id) => axios.get(`/api/payments/${id}`),
};

export default paymentApi;