import { createClient } from '@supabase/supabase-js';

/**
 * EcoTrack Supabase client
 *
 * Required Vite environment variables (create .env.local in the project root):
 * VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
 * VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
 *
 * Use only the project's publishable/anon key in browser code.
 * NEVER use a service_role or secret key here.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'EcoTrack cannot connect to Supabase. Add VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_PUBLISHABLE_KEY to a .env.local file in the project root, then restart the Vite server.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export default supabase;
