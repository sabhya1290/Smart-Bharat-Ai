-- Smart Bharat AI — Add Additional Indexes and Verify Schema
-- Run this in the Supabase SQL Editor to optimize performance for status tracking,
-- user complaints history, and dashboard timelines.

-- Create index on created_at for fast trend analysis and sorting
create index if not exists idx_civic_issues_created_at on civic_issues(created_at);

-- Create index on status for faster dashboard metric aggregations
create index if not exists idx_civic_issues_status on civic_issues(status);

-- Create index on complaint_id for public tracking lookups
create index if not exists idx_civic_issues_complaint_id on civic_issues(complaint_id);

-- Create index on user_id to speed up "My Complaints" loading
create index if not exists idx_civic_issues_user_id on civic_issues(user_id);
