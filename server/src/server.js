import app from './app.js';
import { env, isGeminiConfigured, isSupabaseConfigured } from './config/env.js';

app.listen(env.port, () => {
  console.log(`Smart Bharat AI server running on port ${env.port} (${env.nodeEnv})`);
  console.log(`Gemini AI: ${isGeminiConfigured() ? 'configured' : 'not configured — using mock responses'}`);
  console.log(`Supabase: ${isSupabaseConfigured() ? 'configured' : 'NOT configured — DB calls will fail until set'}`);
});
