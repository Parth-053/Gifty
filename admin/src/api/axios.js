import axios from "axios";
import { auth } from "../config/firebase";

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // FIX: Removed the headers object. 
  // Axios will automatically set 'application/json' for objects 
  // and the correct multipart header with boundary for FormData.
});

// Request Interceptor (Security Layer)
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
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
    return response;
  },
  (error) => {
    // Handle 401/403
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        // Optional: Redirect to login or refresh token
        // window.location.href = "/login"; 
      }
    }

    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      "Something went wrong";

    return Promise.reject({ ...error, message: errorMessage });
  }
);

export default api;