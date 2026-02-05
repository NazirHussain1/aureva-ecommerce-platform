import axios from './axios';

export const productApi = {
  getProducts: (params) => axios.get('/products', { params }),
  getProductById: (id) => axios.get(`/products/${id}`),
  createProduct: (productData) => axios.post('/products', productData),
  updateProduct: (id, productData) => axios.put(`/products/${id}`, productData),
  deleteProduct: (id) => axios.delete(`/products/${id}`),
  getProductReviews: (productId) => axios.get(`/reviews/product/${productId}`),
  createReview: (productId, reviewData) => axios.post(`/reviews/product/${productId}`, reviewData),
  deleteReview: (reviewId) => axios.delete(`/reviews/${reviewId}`),
};

export default productApi;