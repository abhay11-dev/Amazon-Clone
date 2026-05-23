import axios from 'axios';
import { API_BASE_URL } from '../constants/appConstants';

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const userAPI = {
  register: (data) => API.post('/users/register', data),
  signin: (data) => API.post('/users/signin', data),
  logout: () => API.post('/users/logout'),
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  getAllUsers: () => API.get('/users'),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

export const productAPI = {
  getAllProducts: (params) => API.get('/products', { params }),
  getProductById: (id) => API.get(`/products/${id}`),
  searchProducts: (params) => API.get('/products/search', { params }),
  filterProducts: (params) => API.get('/products/filter', { params }),
  getProductsByCategory: (slug, params) => API.get(`/products/category/${slug}`, { params }),
  getSimilarProducts: (id) => API.get(`/products/similar/${id}`),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
};

export const cartAPI = {
  getCart: () => API.get('/cart'),
  addToCart: (data) => API.post('/cart/add', data),
  updateCartItem: (data) => API.put('/cart/update', data),
  removeFromCart: (productId) => API.delete(`/cart/remove/${productId}`),
  clearCart: () => API.delete('/cart/clear'),
};

export const wishlistAPI = {
  getWishlist: () => API.get('/wishlist'),
  addToWishlist: (data) => API.post('/wishlist/add', data),
  removeFromWishlist: (productId) => API.delete(`/wishlist/remove/${productId}`),
  isInWishlist: (productId) => API.get(`/wishlist/check/${productId}`),
  moveToCart: (productId) => API.put(`/wishlist/move-to-cart/${productId}`),
};

export const orderAPI = {
  createOrder: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/mine'),
  getOrderById: (id) => API.get(`/orders/${id}`),
  updateOrderToPaid: (id, data) => API.put(`/orders/${id}/pay`, data),
  getAllOrders: (params) => API.get('/orders', { params }),
};

export const reviewAPI = {
  createReview: (data) => API.post('/reviews', data),
  getProductReviews: (productId, params) => API.get(`/reviews/${productId}`, { params }),
  updateReview: (reviewId, data) => API.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => API.delete(`/reviews/${reviewId}`),
  markHelpful: (reviewId) => API.put(`/reviews/${reviewId}/helpful`),
};

export const categoryAPI = {
  getAllCategories: () => API.get('/categories'),
  getCategoryBySlug: (slug) => API.get(`/categories/${slug}`),
  createCategory: (data) => API.post('/categories', data),
  updateCategory: (id, data) => API.put(`/categories/${id}`, data),
  deleteCategory: (id) => API.delete(`/categories/${id}`),
};

export default API;
