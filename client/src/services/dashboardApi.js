import apiClient from './apiClient.js';

export const fetchDashboardSummary = () => apiClient.get('/dashboard/summary');
