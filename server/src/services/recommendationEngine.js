// Pure rule-based recommendation scorer. Takes the user's profile and a list of
// scheme_rules rows (each joined with its service), returns ranked recommendations.
// Deliberately framework-free so it can later be swapped for an AI-based scorer
// without touching the /api/recommendations route.

const matchesCondition = (profileValue, allowedValues) => {
  if (!allowedValues || allowedValues.length === 0) return true;
  if (!profileValue) return false;
  return allowedValues.includes(profileValue);
};

export const ruleMatchesProfile = (rule, profile) => {
  const condition = rule.condition || {};
  return (
    matchesCondition(profile.age_group, condition.age_group) &&
    matchesCondition(profile.occupation, condition.occupation) &&
    matchesCondition(profile.income_range, condition.income_range) &&
    matchesCondition(profile.category, condition.category) &&
    matchesCondition(profile.state, condition.state)
  );
};

export const buildRecommendations = (rules, profile) => {
  return rules
    .filter((rule) => ruleMatchesProfile(rule, profile))
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .map((rule) => ({
      service: rule.services,
      reason: rule.reason_template,
      priority: rule.priority,
    }));
};
