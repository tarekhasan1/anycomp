// src/services/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiResponse } from '../types/api.types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const message = error.response?.data?.message || 'An error occurred';
    const errors = error.response?.data?.errors;
    
    return Promise.reject({ message, errors, status: error.response?.status });
  }
);

export default api;

