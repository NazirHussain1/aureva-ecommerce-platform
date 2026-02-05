import axios from './axios';

export const authApi = {
  register: (userData) => axios.post('/users/signup', userData),
  login: (credentials) => axios.post('/users/login', credentials),
  logout: () => axios.post('/users/logout'),
  getProfile: () => axios.get('/users/me'),
  forgotPassword: (email) => axios.post('/users/forgot-password', { email }),
  resetPassword: (token, newPassword) => axios.post('/users/reset-password', { token, newPassword }),
};

export default authApi;