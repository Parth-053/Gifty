import axios from 'axios';

// 1. Create Axios Instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... rest of the code (interceptors) remains the same
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 👇 UPDATE THIS PORT TO 8000 TOO
        const { data } = await axios.post(
          'http://localhost:8000/api/v1/auth/refresh-token',
          {},
          { withCredentials: true }
        );
        localStorage.setItem('adminToken', data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;