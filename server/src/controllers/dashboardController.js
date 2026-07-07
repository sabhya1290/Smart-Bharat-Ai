import supabase from '../config/supabaseClient.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

const DEMO_DATA_THRESHOLD = 20;
const RESOLVED_STATUSES = new Set(['Resolved', 'Closed']);

const monthLabel = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const { data: issues, error } = await supabase.from('civic_issues').select('*');
  if (error) throw new AppError(500, error.message);

  const total = issues.length;
  const resolved = issues.filter((i) => RESOLVED_STATUSES.has(i.status));
  const pending = issues.filter((i) => !RESOLVED_STATUSES.has(i.status));

  const avgResolutionDays =
    resolved.length > 0
      ? Math.round(
          resolved.reduce((sum, issue) => {
            const created = new Date(issue.created_at);
            const resolvedAt = issue.estimated_resolution_date
              ? new Date(issue.estimated_resolution_date)
              : created;
            return sum + Math.max(0, (resolvedAt - created) / (1000 * 60 * 60 * 24));
          }, 0) / resolved.length
        )
      : 0;

  const categoryCounts = {};
  const statusCounts = {};
  const stateCounts = {};
  const monthlyCounts = {};

  issues.forEach((issue) => {
    categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
    statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1;
    stateCounts[issue.state] = (stateCounts[issue.state] || 0) + 1;

    const label = monthLabel(new Date(issue.created_at));
    monthlyCounts[label] = (monthlyCounts[label] || 0) + 1;
  });

  ok(res, {
    isDemoData: total < DEMO_DATA_THRESHOLD,
    totals: { total, pending: pending.length, resolved: resolved.length, avgResolutionDays },
    categoryBreakdown: Object.entries(categoryCounts).map(([category, count]) => ({ category, count })),
    statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    monthlyTrend: Object.entries(monthlyCounts).map(([month, count]) => ({ month, count })),
    stateBreakdown: Object.entries(stateCounts).map(([state, count]) => ({ state, count })),
  });
});
