import axios from 'axios';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR (Adds Token) ---
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        // If getting token fails (User deleted in Firebase), logout immediately
        console.error("Token error:", error);
        await signOut(auth);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR (Handles 401 Errors) ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      
      // CRITICAL: Ignore 401 errors from the 'logout' endpoint to prevent loops
      if (originalRequest.url && originalRequest.url.includes('/auth/logout')) {
         return Promise.reject(error);
      }

      console.warn("Session invalid (401). Logging out...");
      
      // 1. Clear Firebase Session
      await signOut(auth);
      
      // 2. Clear Local Storage
      localStorage.removeItem('token');
      
      // 3. Force Redirect to Login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;