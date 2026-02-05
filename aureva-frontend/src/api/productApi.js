import axios from './axios';

export const productApi = {
  getProducts: (params) => axios.get('/api/products', { params }),
  getProductById: (id) => axios.get(`/api/products/${id}`),
  createProduct: (productData) => axios.post('/api/products', productData),
  updateProduct: (id, productData) => axios.put(`/api/products/${id}`, productData),
  deleteProduct: (id) => axios.delete(`/api/products/${id}`),
  getProductReviews: (productId) => axios.get(`/api/reviews/product/${productId}`),
  createReview: (productId, reviewData) => axios.post(`/api/reviews/product/${productId}`, reviewData),
  deleteReview: (reviewId) => axios.delete(`/api/reviews/${reviewId}`),
};

export default productApi;