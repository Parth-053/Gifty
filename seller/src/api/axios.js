import axios from 'axios';
import { API_BASE_URL } from '../utils/constants'; //

// Axios instance creation
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sellerToken'); //
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sellerToken'); 
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;