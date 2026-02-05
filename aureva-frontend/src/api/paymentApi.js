import axios from './axios';

export const paymentApi = {
  processPayment: (paymentData) => axios.post('/payments/process', paymentData),
  getPaymentHistory: () => axios.get('/payments/history'),
  getPaymentDetails: (id) => axios.get(`/payments/${id}`),
};

export default paymentApi;