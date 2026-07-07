import supabase from '../config/supabaseClient.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

// Manual/demo endpoint to append a status update to a complaint's timeline.
// There is no admin auth layer in this build (out of scope per PRD), so this is
// intentionally simple — useful for seeding/demoing status progression.
export const addComplaintUpdate = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const { data: issue, error: issueError } = await supabase
    .from('civic_issues')
    .select('id')
    .eq('complaint_id', req.params.complaintId)
    .maybeSingle();

  if (issueError) throw new AppError(500, issueError.message);
  if (!issue) throw new AppError(404, 'No complaint found with that ID.');

  const { data: update, error } = await supabase
    .from('complaint_updates')
    .insert({ civic_issue_id: issue.id, status, note: note || null })
    .select()
    .single();

  if (error) throw new AppError(500, error.message);

  await supabase.from('civic_issues').update({ status }).eq('id', issue.id);

  created(res, { status: update.status, note: update.note, createdAt: update.created_at });
});

export const getComplaintTimeline = asyncHandler(async (req, res) => {
  const { data: issue, error: issueError } = await supabase
    .from('civic_issues')
    .select('id')
    .eq('complaint_id', req.params.complaintId)
    .maybeSingle();

  if (issueError) throw new AppError(500, issueError.message);
  if (!issue) throw new AppError(404, 'No complaint found with that ID.');

  const { data: updates, error } = await supabase
    .from('complaint_updates')
    .select('*')
    .eq('civic_issue_id', issue.id)
    .order('created_at', { ascending: true });

  if (error) throw new AppError(500, error.message);

  ok(res, updates.map((u) => ({ status: u.status, note: u.note, createdAt: u.created_at })));
});
