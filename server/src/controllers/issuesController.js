import supabase from '../config/supabaseClient.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { generateComplaintId } from '../services/complaintIdGenerator.js';
import { assignDepartment, estimateResolutionDate } from '../services/departmentMapper.js';

const toPublicIssue = (issue) => ({
  id: issue.id,
  complaintId: issue.complaint_id,
  category: issue.category,
  description: issue.description,
  address: issue.address,
  city: issue.city,
  state: issue.state,
  pincode: issue.pincode,
  priority: issue.priority,
  landmark: issue.landmark,
  imageUrl: issue.image_url,
  department: issue.department,
  status: issue.status,
  estimatedResolutionDate: issue.estimated_resolution_date,
  createdAt: issue.created_at,
});

const uploadIssueImage = async (file, complaintId) => {
  if (!file) return null;

  const extension = file.mimetype.split('/')[1] || 'jpg';
  const path = `${complaintId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(env.supabaseStorageBucket)
    .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

  if (error) throw new AppError(500, `Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(env.supabaseStorageBucket).getPublicUrl(path);
  return data.publicUrl;
};

export const createIssue = asyncHandler(async (req, res) => {
  const { category, description, address, city, state, pincode, priority, landmark } = req.body;

  const complaintId = await generateComplaintId();
  const imageUrl = await uploadIssueImage(req.file, complaintId);

  const { data: issue, error } = await supabase
    .from('civic_issues')
    .insert({
      complaint_id: complaintId,
      user_id: req.user.id,
      category,
      description,
      address,
      city,
      state,
      pincode,
      priority,
      landmark: landmark || null,
      image_url: imageUrl,
      department: assignDepartment(category),
      status: 'Submitted',
      estimated_resolution_date: estimateResolutionDate(priority),
    })
    .select()
    .single();

  if (error) throw new AppError(500, error.message);

  await supabase.from('complaint_updates').insert({
    civic_issue_id: issue.id,
    status: 'Submitted',
    note: 'Complaint registered by citizen.',
  });

  created(res, toPublicIssue(issue));
});

export const listMyIssues = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('civic_issues')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(500, error.message);
  ok(res, data.map(toPublicIssue));
});

export const getIssueByComplaintId = asyncHandler(async (req, res) => {
  const { data: issue, error } = await supabase
    .from('civic_issues')
    .select('*')
    .eq('complaint_id', req.params.complaintId)
    .maybeSingle();

  if (error) throw new AppError(500, error.message);
  if (!issue) throw new AppError(404, 'No complaint found with that ID. Please check and try again.');

  const { data: updates, error: updatesError } = await supabase
    .from('complaint_updates')
    .select('*')
    .eq('civic_issue_id', issue.id)
    .order('created_at', { ascending: true });

  if (updatesError) throw new AppError(500, updatesError.message);

  ok(res, {
    ...toPublicIssue(issue),
    timeline: updates.map((u) => ({ status: u.status, note: u.note, createdAt: u.created_at })),
  });
});
