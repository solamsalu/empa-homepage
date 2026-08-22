// E:\EMPA_final\empa-homepage\src\api\apiClient.js

import axios from 'axios';
import { API_BASE_URL } from './constants'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// IMPORTANT: This interceptor will automatically add your token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle common errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If a 401 Unauthorized response is received, you might want to trigger a logout
    if (error.response && error.response.status === 401) {
      console.warn("API call returned 401 Unauthorized. Redirecting to login/logging out...");
      // You can dispatch a global event or redirect here
      // Example: window.location.href = '/login'; // Or better, dispatch an event
    }
    return Promise.reject(error);
  }
);

export default apiClient;