import supabase from '../config/supabaseClient.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { buildRecommendations } from '../services/recommendationEngine.js';

export const getRecommendations = asyncHandler(async (req, res) => {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('age_group, occupation, income_range, category, state')
    .eq('id', req.user.id)
    .maybeSingle();

  if (userError) throw new AppError(500, userError.message);
  if (!user) throw new AppError(404, 'User not found.');

  const { data: rules, error: rulesError } = await supabase
    .from('scheme_rules')
    .select('condition, reason_template, priority, services(*)');

  if (rulesError) throw new AppError(500, rulesError.message);

  const recommendations = buildRecommendations(rules, user).map((rec) => ({
    reason: rec.reason,
    priority: rec.priority,
    service: rec.service
      ? {
          id: rec.service.id,
          name: rec.service.name,
          category: rec.service.category,
          description: rec.service.description,
          eligibility: rec.service.eligibility,
          requiredDocuments: rec.service.required_documents,
          processingTime: rec.service.processing_time,
          officialUrl: rec.service.official_url,
        }
      : null,
  }));

  ok(res, {
    profileComplete: Boolean(user.age_group && user.category),
    recommendations,
  });
});
