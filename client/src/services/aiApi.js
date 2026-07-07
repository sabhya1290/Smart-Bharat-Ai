import apiClient from './apiClient.js';

export const sendChatMessage = (message, language) => apiClient.post('/ai/chat', { message, language });
export const fetchChatHistory = () => apiClient.get('/ai/chat/history');
