import apiClient from './apiClient.js';

export const updateProfile = (payload) => apiClient.put('/profile', payload);
