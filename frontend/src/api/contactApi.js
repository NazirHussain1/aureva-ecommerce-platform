import axios from './axios';

export const submitContactForm = async (formData) => {
  const response = await axios.post('/api/contact', formData);
  return response.data;
};

export const getAllMessages = async (params) => {
  const response = await axios.get('/api/contact', { params });
  return response.data;
};

export const getMessageById = async (id) => {
  const response = await axios.get(`/api/contact/${id}`);
  return response.data;
};

export const markMessageAsRead = async (id) => {
  const response = await axios.patch(`/api/contact/${id}/read`);
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await axios.delete(`/api/contact/${id}`);
  return response.data;
};
