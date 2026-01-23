// src/api/axios.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { auth } from '../config/firebase'; // Import auth

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // Check if a user is logged in via Firebase
    if (auth.currentUser) {
      // Force fetch a fresh token (handles expiry automatically)
      const token = await auth.currentUser.getIdToken();
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
    // Optional: Handle 401 globally
    return Promise.reject(error);
  }
);

export default api;