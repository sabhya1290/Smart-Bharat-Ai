-- Smart Bharat AI — Seed: 15 realistic government services
-- Run after schema.sql

insert into services (name, category, description, eligibility, required_documents, processing_time, official_url, states, nationwide)
values
(
  'Aadhaar Address/Details Update',
  'Identity Documents',
  'Update your name, address, date of birth, or mobile number linked to your Aadhaar card online or at an Aadhaar Seva Kendra.',
  'All Aadhaar holders. Address update requires a valid proof-of-address document.',
  array['Aadhaar number','Proof of address (utility bill/bank passbook)','Proof of identity (if updating name/DOB)'],
  '7-15 working days',
  'https://uidai.gov.in',
  '{}', true
),
(
  'PAN Card Application/Correction',
  'Identity Documents',
  'Apply for a new Permanent Account Number (PAN) or correct existing PAN details for tax and financial transactions.',
  'Any Indian citizen or entity required to file income tax or conduct high-value financial transactions.',
  array['Proof of identity','Proof of address','Proof of date of birth','Passport-size photograph'],
  '15-20 working days',
  'https://www.onlineservices.nsdl.com',
  '{}', true
),
(
  'Driving Licence (Learner & Permanent)',
  'Transport',
  'Apply for a learner licence, book a driving test, and get a permanent driving licence issued by your state transport department.',
  'Minimum age 18 for gearless/geared vehicles (16 for gearless without gear, with guardian consent). Must pass the RTO test.',
  array['Age proof','Address proof','Passport-size photographs','Medical certificate (Form 1A, for transport vehicles)'],
  '30-45 days (learner to permanent)',
  'https://parivahan.gov.in',
  '{}', true
),
(
  'Passport Application (Fresh/Renewal)',
  'Travel Documents',
  'Apply for a new Indian passport or renew an expiring one through the Passport Seva portal and nearest Passport Seva Kendra.',
  'Indian citizens. Minors require guardian consent and additional documents.',
  array['Proof of address','Proof of date of birth','Aadhaar card','Old passport (for renewal)'],
  '30-45 days (Normal), 7-10 days (Tatkaal)',
  'https://www.passportindia.gov.in',
  '{}', true
),
(
  'Ration Card (New/Modification)',
  'Food & Public Distribution',
  'Apply for a new ration card or update member details to access subsidized food grains through the Public Distribution System.',
  'Indian residents; eligibility category (APL/BPL/AAY) determined by state food department based on income.',
  array['Aadhaar card','Address proof','Income certificate','Family photograph'],
  '30-60 days',
  'https://nfsa.gov.in',
  '{}', true
),
(
  'Birth Certificate',
  'Civil Registration',
  'Register a birth and obtain an official birth certificate from the local municipal corporation or gram panchayat.',
  'Parents/guardians of the child; birth must be registered within 21 days for standard process (late registration also possible).',
  array['Hospital birth proof/discharge summary','Parents'' ID proof','Address proof'],
  '7-15 working days',
  'https://crsorgi.gov.in',
  '{}', true
),
(
  'Income Certificate',
  'Revenue & Certificates',
  'Obtain an official income certificate from the Tehsildar/Revenue office, required for scholarships, reservations, and welfare schemes.',
  'Residents of the state; income assessed based on family earnings declared and verified by revenue officials.',
  array['Aadhaar card','Address proof','Salary slip / self-employment income proof','Passport-size photograph'],
  '15-21 working days',
  'https://edistrict.gov.in',
  '{}', true
),
(
  'Caste Certificate',
  'Revenue & Certificates',
  'Obtain a caste certificate (SC/ST/OBC) from the Revenue Department for admissions, jobs, and scheme eligibility.',
  'Applicants belonging to a recognized SC/ST/OBC category as per state/central lists.',
  array['Aadhaar card','Address proof','Parent''s caste certificate (if available)','Self-declaration affidavit'],
  '15-30 working days',
  'https://edistrict.gov.in',
  '{}', true
),
(
  'Ayushman Bharat (PM-JAY) Health Card',
  'Healthcare',
  'Enroll in the Ayushman Bharat Pradhan Mantri Jan Arogya Yojana for free health insurance coverage up to Rs. 5 lakh per family per year.',
  'Families identified as eligible under SECC 2011 database or state-specific extension criteria.',
  array['Aadhaar card','Ration card / family ID','Mobile number for OTP verification'],
  'Instant e-card generation after eligibility verification',
  'https://pmjay.gov.in',
  '{}', true
),
(
  'PM-KISAN Samman Nidhi',
  'Agriculture',
  'Direct income support scheme providing Rs. 6,000 per year to eligible farmer families in three equal installments.',
  'Small and marginal farmer families with cultivable landholding, as per state land records.',
  array['Aadhaar card','Land ownership records','Bank account passbook (linked to Aadhaar)'],
  '30-60 days for first installment after verification',
  'https://pmkisan.gov.in',
  '{}', true
),
(
  'National Scholarship Portal (NSP)',
  'Education',
  'Apply for central and state government scholarships for school and college students based on merit and/or income.',
  'Students enrolled in recognized institutions meeting scheme-specific income and academic criteria.',
  array['Aadhaar card','Bank account details','Previous year mark sheet','Income certificate','Bonafide student certificate'],
  '45-90 days (subject to verification levels)',
  'https://scholarships.gov.in',
  '{}', true
),
(
  'National Pension Scheme for Senior Citizens (IGNOAPS)',
  'Social Welfare',
  'Monthly pension support for eligible senior citizens under the Indira Gandhi National Old Age Pension Scheme.',
  'Citizens aged 60+ belonging to BPL households as per state-specific criteria.',
  array['Aadhaar card','Age proof','BPL certificate','Bank account passbook'],
  '30-45 working days',
  'https://nsap.nic.in',
  '{}', true
),
(
  'National Career Service (Employment Registration)',
  'Employment',
  'Register on the National Career Service portal for job matching, career counselling, and skill development programs.',
  'Any job-seeking Indian citizen; students and employers can also register.',
  array['Aadhaar card','Educational certificates','Resume/CV','Email ID and mobile number'],
  'Instant registration; job matching ongoing',
  'https://www.ncs.gov.in',
  '{}', true
),
(
  'Voter ID (EPIC) Registration/Correction',
  'Identity Documents',
  'Register as a new voter, update details, or transfer your voter registration through the Election Commission portal.',
  'Indian citizens aged 18 and above as of the qualifying date.',
  array['Age proof','Address proof','Passport-size photograph'],
  '20-30 working days',
  'https://voters.eci.gov.in',
  '{}', true
),
(
  'GST Registration',
  'Business & Taxation',
  'Register for Goods and Services Tax (GST) for businesses exceeding the prescribed turnover threshold or engaged in interstate supply.',
  'Businesses/individuals with turnover above the threshold limit, or those voluntarily opting for registration.',
  array['PAN card','Proof of business address','Bank account details','Photograph of proprietor/partners','Business registration proof (if applicable)'],
  '3-7 working days',
  'https://www.gst.gov.in',
  '{}', true
);
