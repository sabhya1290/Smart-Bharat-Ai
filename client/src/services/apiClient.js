import axios from 'axios';
import supabase from './supabaseClient.js';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

apiClient.interceptors.request.use(async (config) => {
  // Prefer a fresh Supabase session token; fall back to localStorage (legacy)
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || localStorage.getItem('sb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject({ message, status: error.response?.status, details: error.response?.data?.details });
  }
);

export default apiClient;
