export const ISSUE_CATEGORIES = [
  { value: 'garbage_collection', label: 'Garbage Collection' },
  { value: 'road_damage', label: 'Road Damage' },
  { value: 'streetlight_issue', label: 'Streetlight Issue' },
  { value: 'water_leakage', label: 'Water Leakage' },
  { value: 'drainage_problem', label: 'Drainage Problem' },
  { value: 'broken_footpath', label: 'Broken Footpath' },
  { value: 'public_safety', label: 'Public Safety' },
  { value: 'other', label: 'Other' },
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const AGE_GROUPS = [
  { value: 'under_18', label: 'Under 18' },
  { value: '18_25', label: '18 - 25' },
  { value: '26_35', label: '26 - 35' },
  { value: '36_45', label: '36 - 45' },
  { value: '46_60', label: '46 - 60' },
  { value: '60_plus', label: '60+' },
];

export const INCOME_RANGES = [
  { value: 'below_2_5l', label: 'Below ₹2.5 Lakh' },
  { value: '2_5l_5l', label: '₹2.5 Lakh - ₹5 Lakh' },
  { value: '5l_10l', label: '₹5 Lakh - ₹10 Lakh' },
  { value: 'above_10l', label: 'Above ₹10 Lakh' },
  { value: 'not_specified', label: 'Prefer not to say' },
];

export const USER_CATEGORIES = [
  { value: 'student', label: 'Student' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'worker', label: 'Worker' },
  { value: 'senior_citizen', label: 'Senior Citizen' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'other', label: 'Other' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

export const COMPLAINT_STATUSES = [
  'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed',
];

export const STATUS_COLORS = {
  Submitted: 'bg-gray-100 text-gray-700',
  'Under Review': 'bg-brand-saffron-100 text-brand-saffron-700',
  Assigned: 'bg-brand-blue-100 text-brand-blue-700',
  'In Progress': 'bg-brand-blue-100 text-brand-blue-700',
  Resolved: 'bg-brand-green-100 text-brand-green-700',
  Closed: 'bg-brand-green-100 text-brand-green-700',
};
