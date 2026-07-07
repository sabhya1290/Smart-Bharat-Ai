import apiClient from './apiClient.js';

// Fetch the current user's profile from public.users (requires auth token)
export const fetchCurrentUser = () => apiClient.get('/auth/me');

// Sync profile data to public.users after first OAuth / email login
export const syncUserProfile = (payload) => apiClient.post('/auth/sync-profile', payload);
