import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://172.236.144.75:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken") ?? sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      sessionStorage.removeItem("userRole");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      // Show toast message
      toast.error("Session expired. Please log in again.", {
        toastId: 'unauth-toast', // prevent duplicates
      });

      // Redirect after short delay to allow user to read the toast
      setTimeout(() => {
        window.location.href = '/login';
      }, 4000); // 3 seconds
    }

    return Promise.reject(error);
  }
);

export default instance;
