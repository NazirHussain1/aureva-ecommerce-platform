import axios from './axios';

export const cartApi = {
  getCart: () => axios.get('/cart'),
  addToCart: (productId, quantity) => axios.post('/cart', { productId, quantity }),
  updateCartItem: (id, quantity) => axios.put(`/cart/${id}`, { quantity }),
  removeFromCart: (id) => axios.delete(`/cart/${id}`),
};

export default cartApi;