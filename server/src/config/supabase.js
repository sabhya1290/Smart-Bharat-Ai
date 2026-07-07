import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env.js';

let supabase = null;

if (isSupabaseConfigured()) {
  supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
} else {
  console.warn(
    '[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — database calls will fail until configured.'
  );
}

export default supabase;
export { supabase };
