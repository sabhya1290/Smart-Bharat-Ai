import supabase from '../config/supabaseClient.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

const toPublicService = (service) => ({
  id: service.id,
  name: service.name,
  category: service.category,
  description: service.description,
  eligibility: service.eligibility,
  requiredDocuments: service.required_documents,
  processingTime: service.processing_time,
  officialUrl: service.official_url,
  states: service.states,
  nationwide: service.nationwide,
});

export const listServices = asyncHandler(async (req, res) => {
  const { search, category, state } = req.query;

  let query = supabase.from('services').select('*').order('name', { ascending: true });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (category) {
    query = query.eq('category', category);
  }
  if (state) {
    query = query.or(`nationwide.eq.true,states.cs.{${state}}`);
  }

  const { data, error } = await query;
  if (error) throw new AppError(500, error.message);

  ok(res, data.map(toPublicService));
});

export const getServiceById = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();

  if (error) throw new AppError(500, error.message);
  if (!data) throw new AppError(404, 'Service not found.');

  ok(res, toPublicService(data));
});

export const bookmarkService = asyncHandler(async (req, res) => {
  const { error } = await supabase
    .from('user_saved_services')
    .upsert({ user_id: req.user.id, service_id: req.params.id }, { onConflict: 'user_id,service_id' });

  if (error) throw new AppError(500, error.message);
  ok(res, { bookmarked: true });
});

export const removeBookmark = asyncHandler(async (req, res) => {
  const { error } = await supabase
    .from('user_saved_services')
    .delete()
    .eq('user_id', req.user.id)
    .eq('service_id', req.params.id);

  if (error) throw new AppError(500, error.message);
  ok(res, { bookmarked: false });
});

export const listBookmarkedServices = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('user_saved_services')
    .select('saved_at, services(*)')
    .eq('user_id', req.user.id)
    .order('saved_at', { ascending: false });

  if (error) throw new AppError(500, error.message);

  ok(
    res,
    data.map((row) => ({ ...toPublicService(row.services), savedAt: row.saved_at }))
  );
});
