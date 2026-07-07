-- Smart Bharat AI — Seed: scheme_rules for the recommendation engine
-- Run after seed_services.sql. Uses subselects on services.name so it works
-- regardless of generated UUIDs.
--
-- condition jsonb shape (all keys optional, empty/absent = matches any):
--   { "age_group": ["60_plus"], "occupation": ["farmer"], "category": ["farmer"],
--     "income_range": ["below_2_5l","2_5l_5l"], "state": ["Maharashtra"] }

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"category": ["farmer"], "occupation": ["farmer"]}'::jsonb,
  'Recommended because you identified as a farmer — PM-KISAN provides direct annual income support to eligible farmer families.', 90
from services where name = 'PM-KISAN Samman Nidhi';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"category": ["farmer"], "occupation": ["farmer"], "income_range": ["below_2_5l","2_5l_5l"]}'::jsonb,
  'Recommended for farmer families with modest income — Ayushman Bharat covers hospitalization expenses up to Rs. 5 lakh.', 70
from services where name = 'Ayushman Bharat (PM-JAY) Health Card';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"category": ["student"]}'::jsonb,
  'Recommended because your profile is marked as a student — explore central and state scholarships you may be eligible for.', 95
from services where name = 'National Scholarship Portal (NSP)';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"category": ["student"], "age_group": ["18_25"]}'::jsonb,
  'Recommended for students building their first identity documents — a PAN card is often required for scholarship disbursement.', 60
from services where name = 'PAN Card Application/Correction';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"category": ["senior_citizen"], "age_group": ["60_plus"]}'::jsonb,
  'Recommended because your profile indicates senior citizen status — IGNOAPS provides monthly pension support for eligible BPL seniors.', 95
from services where name = 'National Pension Scheme for Senior Citizens (IGNOAPS)';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"age_group": ["60_plus"]}'::jsonb,
  'Recommended for senior citizens — Ayushman Bharat helps cover major hospitalization costs.', 65
from services where name = 'Ayushman Bharat (PM-JAY) Health Card';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"category": ["worker"]}'::jsonb,
  'Recommended because your profile is marked as a worker — register on the National Career Service portal for better job opportunities.', 80
from services where name = 'National Career Service (Employment Registration)';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"category": ["worker"], "income_range": ["below_2_5l","2_5l_5l"]}'::jsonb,
  'Recommended for workers with lower income brackets — an income certificate is often needed to access welfare benefits.', 55
from services where name = 'Income Certificate';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"category": ["entrepreneur"]}'::jsonb,
  'Recommended because your profile is marked as an entrepreneur — GST registration is required once your turnover crosses the threshold.', 85
from services where name = 'GST Registration';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{}'::jsonb,
  'Recommended for every citizen — Aadhaar is the foundational ID needed for most government services.', 30
from services where name = 'Aadhaar Address/Details Update';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{}'::jsonb,
  'Recommended for every citizen — Voter ID enables you to participate in elections and serves as valid photo identification.', 20
from services where name = 'Voter ID (EPIC) Registration/Correction';

insert into scheme_rules (service_id, condition, reason_template, priority)
select id, '{"income_range": ["below_2_5l"]}'::jsonb,
  'Recommended for lower-income households — a ration card gives access to subsidized food grains through the PDS.', 75
from services where name = 'Ration Card (New/Modification)';
