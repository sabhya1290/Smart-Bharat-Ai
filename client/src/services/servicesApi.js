import apiClient from './apiClient.js';

export const fetchServices = (params = {}) => apiClient.get('/services', { params });
export const fetchServiceById = (id) => apiClient.get(`/services/${id}`);
export const bookmarkService = (id) => apiClient.post(`/services/${id}/bookmark`);
export const removeBookmark = (id) => apiClient.delete(`/services/${id}/bookmark`);
export const fetchBookmarkedServices = () => apiClient.get('/services/bookmarked');
