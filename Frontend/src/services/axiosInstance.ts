import axios from 'axios';

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

export default instance;
