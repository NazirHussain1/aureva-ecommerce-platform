import axios from './axios';

export const authApi = {
  register: (userData) => axios.post('/api/users/register', userData),
  login: (credentials) => axios.post('/api/users/login', credentials),
  logout: () => axios.post('/api/users/logout'),
  getProfile: () => axios.get('/api/users/me'),
  forgotPassword: (email) => axios.post('/api/users/forgot-password', { email }),
  resetPassword: (token, newPassword) => axios.post('/api/users/reset-password', { token, newPassword }),
};

export default authApi;