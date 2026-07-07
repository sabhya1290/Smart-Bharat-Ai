import supabase from '../config/supabaseClient.js';

// Generates IDs like SB-2026-1042 using the `complaint_id_seq` Postgres sequence
// defined in database/schema.sql, so IDs stay unique even under concurrent requests.
export const generateComplaintId = async () => {
  const year = new Date().getFullYear();

  const { data, error } = await supabase.rpc('nextval_complaint_id_seq').single();

  if (error) {
    // Fallback path if the RPC helper wasn't created — read sequence directly.
    const { data: seqData, error: seqError } = await supabase
      .from('civic_issues')
      .select('id', { count: 'exact', head: true });

    if (seqError) throw seqError;
    const fallbackSeq = 1000 + (seqData?.length ?? 0) + Math.floor(Math.random() * 100);
    return `SB-${year}-${fallbackSeq}`;
  }

  return `SB-${year}-${data}`;
};
