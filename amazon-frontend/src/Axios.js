import axios from "axios";

// Ensure environment variable is properly set with fallback
const API_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? 'https://amazon-clone-bice-xi.vercel.app'
    : 'http://localhost:5000'
);

const api = axios.create({
  baseURL: `${API_URL}/api`
});

// Add auth token to all requests
api.interceptors.request.use(
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

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;