import api from '../Axios';

// Export API objects using the shared axios instance from Axios.js
// All endpoints should NOT include /api prefix since it's in the baseURL

export const userAPI = {
  register: (data) => api.post('/users/register', data),
  signin: (data) => api.post('/users/signin', data),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (params) => api.get('/products/search', { params }),
  filterProducts: (params) => api.get('/products/filter', { params }),
  getProductsByCategory: (slug, params) => api.get(`/products/category/${slug}`, { params }),
  getSimilarProducts: (id) => api.get(`/products/similar/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCartItem: (data) => api.put('/cart/update', data),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (data) => api.post('/wishlist/add', data),
  removeFromWishlist: (productId) => api.delete(`/wishlist/remove/${productId}`),
  isInWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
  moveToCart: (productId) => api.put(`/wishlist/move-to-cart/${productId}`),
};

export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/mine'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderToPaid: (id, data) => api.put(`/orders/${id}/pay`, data),
  getAllOrders: (params) => api.get('/orders', { params }),
};

export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getProductReviews: (productId, params) => api.get(`/reviews/${productId}`, { params }),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  markHelpful: (reviewId) => api.put(`/reviews/${reviewId}/helpful`),
};

export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export default api;
