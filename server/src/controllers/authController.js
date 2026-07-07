import supabase from '../config/supabaseClient.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

// Shape of user returned to client — matches our public.users table
const toPublicUser = (user) => ({
  id: user.id,
  email: user.email,
  fullName: user.full_name,
  phone: user.phone,
  state: user.state,
  ageGroup: user.age_group,
  occupation: user.occupation,
  incomeRange: user.income_range,
  category: user.category,
  preferredLanguage: user.preferred_language,
  accessibilityPrefs: user.accessibility_prefs,
});

/**
 * GET /auth/me
 * Returns the authenticated user's profile from public.users.
 * Called after Supabase Auth verifies the token via requireAuth middleware.
 */
export const getMe = asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .maybeSingle();

  if (error) throw new AppError(500, error.message);
  if (!user) throw new AppError(404, 'User not found.');

  ok(res, { user: toPublicUser(user) });
});

/**
 * POST /auth/sync-profile
 * Called from the client after a successful Supabase Auth sign-in (email or Google).
 * Upserts the user row in public.users so profile data is available.
 * Supabase Auth manages credentials — this just syncs display info.
 */
export const syncProfile = asyncHandler(async (req, res) => {
  const { fullName, phone } = req.body;

  // Check if a profile row already exists for this Supabase Auth user ID
  const { data: existingById } = await supabase
    .from('users')
    .select('id')
    .eq('id', req.user.id)
    .maybeSingle();

  if (!existingById) {
    // Check if a row exists with the same email (from the old bcrypt system)
    const { data: existingByEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', req.user.email)
      .maybeSingle();

    if (existingByEmail) {
      // Migrate: update the old row's id to match the new Supabase Auth user id
      await supabase
        .from('users')
        .update({ id: req.user.id, password_hash: 'supabase-auth' })
        .eq('email', req.user.email);
    } else {
      // Brand new user — insert fresh row
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: req.user.id,
          email: req.user.email,
          full_name: fullName || req.user.email.split('@')[0],
          phone: phone || null,
          password_hash: 'supabase-auth',
        });
      if (insertError) throw new AppError(500, insertError.message);
    }
  }

  // Return the final profile row
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) throw new AppError(500, error.message);
  ok(res, { user: toPublicUser(user) });
});

export { toPublicUser };
