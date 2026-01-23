import axios from "axios";
import { auth } from "../config/firebase";

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Security Layer)

api.interceptors.request.use(
  async (config) => {
    try {
      // 1. Check if a user is logged in via Firebase
      const user = auth.currentUser;

      if (user) {
        // 2. Get the latest ID Token (Force refresh if needed)
        const token = await user.getIdToken();
        
        // 3. Attach to Headers
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error("Error attaching auth token:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Global Error Handling)

api.interceptors.response.use(
  (response) => {
    // Return the full response (or just response.data if you prefer)
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) & 403 (Forbidden)
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        console.warn("Unauthorized access. Redirecting to login...");
        window.location.href = "/login"; 
      }
    }

    // Standardize Error Message
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      "Something went wrong";

    // Reject with a clean error object
    return Promise.reject({ ...error, message: errorMessage });
  }
);

export default api;