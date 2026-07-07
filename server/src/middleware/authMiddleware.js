import supabase from '../config/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new AppError(401, 'Authentication required.');
  }

  // Verify token using Supabase Auth (handles both email & Google OAuth tokens)
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    throw new AppError(401, 'Invalid or expired session. Please log in again.');
  }

  req.user = { id: data.user.id, email: data.user.email };
  next();
});
