import axios from './axios';

export const submitContactForm = async (formData) => {
  const response = await axios.post('/contact', formData);
  return response.data;
};

export const getAllMessages = async (params) => {
  const response = await axios.get('/contact', { params });
  return response.data;
};

export const getMessageById = async (id) => {
  const response = await axios.get(`/contact/${id}`);
  return response.data;
};

export const markMessageAsRead = async (id) => {
  const response = await axios.patch(`/contact/${id}/read`);
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await axios.delete(`/contact/${id}`);
  return response.data;
};
