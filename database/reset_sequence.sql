-- Smart Bharat AI — Reset Complaint ID Sequence
-- Run this in the Supabase SQL Editor to fix the duplicate key constraint error.
--
-- Since we seeded 5 mock complaints manually (SB-2026-1001 to SB-2026-1005),
-- the sequence 'complaint_id_seq' needs to start AFTER 1005 to prevent conflicts.

-- Set the sequence to start at 1010 (allowing safe padding)
select setval('complaint_id_seq', 1010);
