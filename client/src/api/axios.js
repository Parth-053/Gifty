// client/src/api/axios.js
import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  // Ensure this matches your VITE_API_URL or backend URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // Current user check
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Get fresh token (handles expiry automatically)
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;