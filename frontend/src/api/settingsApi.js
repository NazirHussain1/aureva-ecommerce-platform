import axios from './axios';

export const getPublicSettings = async () => {
  const response = await axios.get('/api/settings');
  return response.data;
};

export const getSettings = async () => {
  const response = await axios.get('/api/admin/settings');
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await axios.put('/api/admin/settings', settingsData);
  return response.data;
};
