import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'civic-issues',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export const isGeminiConfigured = () => Boolean(env.geminiApiKey);
export const isSupabaseConfigured = () => Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
