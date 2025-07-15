import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5063/api',
});

// Add a request interceptor to attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;


