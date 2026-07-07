-- Smart Bharat AI — Seed: sample civic issues + timeline updates
-- Run after schema.sql. user_id left null (demo data, not tied to a real account)
-- so the transparency dashboard and complaint tracker have non-empty data out of the box.

insert into civic_issues (
  complaint_id, user_id, category, description, address, city, state, pincode,
  priority, landmark, image_url, department, status, estimated_resolution_date, created_at
) values
(
  'SB-2026-1001', null, 'streetlight_issue',
  'Streetlight has been non-functional for two weeks near the main market junction, making the area unsafe at night.',
  'Main Market Road, near Bus Stand', 'Lucknow', 'Uttar Pradesh', '226001',
  'high', 'Opposite Bus Stand', null,
  'Electricity & Street Lighting Department', 'In Progress', current_date + interval '5 days', now() - interval '12 days'
),
(
  'SB-2026-1002', null, 'garbage_collection',
  'Garbage has not been collected from the residential colony for over a week, causing foul smell and health concerns.',
  'Sector 12, Green Park Colony', 'Pune', 'Maharashtra', '411001',
  'medium', 'Near Community Hall', null,
  'Sanitation Department', 'Resolved', current_date - interval '2 days', now() - interval '20 days'
),
(
  'SB-2026-1003', null, 'road_damage',
  'Large pothole has formed on the main road causing traffic slowdowns and risk to two-wheeler riders.',
  'Ring Road, Sector 5', 'Bengaluru', 'Karnataka', '560001',
  'urgent', 'Near Metro Station Exit 2', null,
  'Public Works Department', 'Assigned', current_date + interval '10 days', now() - interval '6 days'
),
(
  'SB-2026-1004', null, 'water_leakage',
  'Continuous water leakage from a broken pipeline is flooding the street and wasting municipal water supply.',
  '4th Cross Street, Anna Nagar', 'Chennai', 'Tamil Nadu', '600040',
  'high', 'Near Anna Nagar Park', null,
  'Water Supply Department', 'Under Review', current_date + interval '7 days', now() - interval '3 days'
),
(
  'SB-2026-1005', null, 'drainage_problem',
  'Open drainage is overflowing after recent rains, creating unsanitary conditions and mosquito breeding.',
  'Old Town, Ward 9', 'Patna', 'Bihar', '800001',
  'medium', null, null,
  'Sanitation Department', 'Submitted', current_date + interval '15 days', now() - interval '1 days'
);

-- Timeline updates for each seeded complaint
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Submitted', 'Complaint registered by citizen.', created_at
from civic_issues where complaint_id = 'SB-2026-1001';
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Under Review', 'Forwarded to Electricity & Street Lighting Department for verification.', created_at + interval '2 days'
from civic_issues where complaint_id = 'SB-2026-1001';
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Assigned', 'Field technician assigned to inspect the streetlight.', created_at + interval '5 days'
from civic_issues where complaint_id = 'SB-2026-1001';
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'In Progress', 'Replacement part ordered; repair scheduled.', created_at + interval '9 days'
from civic_issues where complaint_id = 'SB-2026-1001';

insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Submitted', 'Complaint registered by citizen.', created_at
from civic_issues where complaint_id = 'SB-2026-1002';
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Assigned', 'Assigned to local sanitation crew.', created_at + interval '2 days'
from civic_issues where complaint_id = 'SB-2026-1002';
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'In Progress', 'Additional collection vehicle dispatched.', created_at + interval '10 days'
from civic_issues where complaint_id = 'SB-2026-1002';
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Resolved', 'Backlog cleared and regular collection schedule restored.', created_at + interval '18 days'
from civic_issues where complaint_id = 'SB-2026-1002';

insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Submitted', 'Complaint registered by citizen.', created_at
from civic_issues where complaint_id = 'SB-2026-1003';
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Under Review', 'Site inspection scheduled by Public Works Department.', created_at + interval '2 days'
from civic_issues where complaint_id = 'SB-2026-1003';
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Assigned', 'Repair crew assigned; materials being procured.', created_at + interval '5 days'
from civic_issues where complaint_id = 'SB-2026-1003';

insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Submitted', 'Complaint registered by citizen.', created_at
from civic_issues where complaint_id = 'SB-2026-1004';
insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Under Review', 'Water Supply Department notified for urgent inspection.', created_at + interval '1 days'
from civic_issues where complaint_id = 'SB-2026-1004';

insert into complaint_updates (civic_issue_id, status, note, created_at)
select id, 'Submitted', 'Complaint registered by citizen.', created_at
from civic_issues where complaint_id = 'SB-2026-1005';
