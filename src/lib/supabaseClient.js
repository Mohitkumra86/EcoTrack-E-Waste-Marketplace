import { createClient } from '@supabase/supabase-js';

/**
 * EcoTrack Supabase client
 *
 * Required Vite environment variables (configure in .env.local in project root):
 * VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
 * VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-public-key>  (or VITE_SUPABASE_ANON_KEY)
 *
 * Use only the project's publishable/anon key in browser client code.
 * NEVER use a service_role secret key in frontend code.
 */
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env) ? process.env : {};

export const supabaseUrl = env.VITE_SUPABASE_URL?.trim();
export const supabaseKey = (
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_KEY
)?.trim();

export function isPlaceholderValue(val) {
  if (!val) return true;
  const lower = val.toLowerCase();
  return (
    lower.includes('your-project-id') ||
    lower.includes('your_project_id') ||
    lower.includes('your-supabase-anon-key') ||
    lower.includes('placeholder') ||
    lower === 'undefined' ||
    lower === 'null'
  );
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !isPlaceholderValue(supabaseUrl) &&
  !isPlaceholderValue(supabaseKey) &&
  supabaseUrl.startsWith('https://')
);

export function getMissingSupabaseConfig() {
  const missing = [];
  if (!supabaseUrl || isPlaceholderValue(supabaseUrl)) {
    missing.push('VITE_SUPABASE_URL');
  }
  if (!supabaseKey || isPlaceholderValue(supabaseKey)) {
    missing.push('VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  }
  return missing;
}

if (!isSupabaseConfigured) {
  const missing = getMissingSupabaseConfig();
  console.info(
    `%c[EcoTrack]%c Supabase credentials unconfigured. Missing: ${missing.join(', ')}. Create .env.local in the project root to connect live Supabase backend.`,
    'color: #16a34a; font-weight: bold;',
    'color: inherit;'
  );
}

// Fallback client to prevent bundle or hook errors before credentials are provided
const effectiveUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const effectiveKey = isSupabaseConfigured ? supabaseKey : 'placeholder-anon-key';

export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export default supabase;
