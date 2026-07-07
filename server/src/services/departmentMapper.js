const CATEGORY_DEPARTMENT_MAP = {
  garbage_collection: 'Sanitation Department',
  road_damage: 'Public Works Department',
  streetlight_issue: 'Electricity & Street Lighting Department',
  water_leakage: 'Water Supply Department',
  drainage_problem: 'Sanitation Department',
  broken_footpath: 'Public Works Department',
  public_safety: 'Municipal Public Safety Cell',
  other: 'General Grievance Cell',
};

const PRIORITY_RESOLUTION_DAYS = {
  urgent: 3,
  high: 7,
  medium: 14,
  low: 21,
};

export const assignDepartment = (category) => CATEGORY_DEPARTMENT_MAP[category] || CATEGORY_DEPARTMENT_MAP.other;

export const estimateResolutionDate = (priority) => {
  const days = PRIORITY_RESOLUTION_DAYS[priority] ?? PRIORITY_RESOLUTION_DAYS.medium;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};
