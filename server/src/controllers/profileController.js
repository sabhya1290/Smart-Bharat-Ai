import supabase from '../config/supabaseClient.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { toPublicUser } from './authController.js';

const CAMEL_TO_SNAKE = {
  fullName: 'full_name',
  phone: 'phone',
  state: 'state',
  ageGroup: 'age_group',
  occupation: 'occupation',
  incomeRange: 'income_range',
  category: 'category',
  preferredLanguage: 'preferred_language',
  accessibilityPrefs: 'accessibility_prefs',
};

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};
  Object.entries(req.body).forEach(([key, value]) => {
    if (value !== undefined && CAMEL_TO_SNAKE[key]) {
      updates[CAMEL_TO_SNAKE[key]] = value;
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new AppError(422, 'No valid fields provided to update.');
  }

  const { data: user, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) throw new AppError(500, error.message);

  ok(res, { user: toPublicUser(user) });
});
