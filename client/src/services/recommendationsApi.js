import apiClient from './apiClient.js';

export const fetchRecommendations = () => apiClient.get('/recommendations');
