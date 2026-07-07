import apiClient from './apiClient.js';

export const createIssue = (formData) =>
  apiClient.post('/issues', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const fetchMyIssues = () => apiClient.get('/issues/mine');
export const fetchIssueByComplaintId = (complaintId) => apiClient.get(`/issues/${complaintId}`);
