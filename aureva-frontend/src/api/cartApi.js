import axios from './axios';

export const cartApi = {
  getCart: () => axios.get('/api/cart'),
  addToCart: (productId, quantity) => axios.post('/api/cart', { productId, quantity }),
  updateCartItem: (id, quantity) => axios.put(`/api/cart/${id}`, { quantity }),
  removeFromCart: (id) => axios.delete(`/api/cart/${id}`),
};

export default cartApi;