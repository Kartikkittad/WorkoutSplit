/**
 * Centralized Environment Configuration
 * All environment variables MUST be accessed exclusively through this file.
 */

export const env = {
  // Public / Client-side Variables (Must start with NEXT_PUBLIC_)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',

  // Server-side Only Variables
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Environment Helpers
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Feature Check Helpers
  isDatabaseConfigured: Boolean(process.env.DATABASE_URL),
  isSupabaseConfigured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
  isTurnstileConfigured: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
};

/**
 * Validate that mandatory variables are defined.
 * Logs warnings in development to aid local debugging without breaking builds.
 */
export function validateEnv() {
  if (typeof window === 'undefined') {
    const missing: string[] = [];
    if (!env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    if (!env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) missing.push('NEXT_PUBLIC_TURNSTILE_SITE_KEY');

    if (missing.length > 0) {
      console.warn(
        `[env.ts] ⚠️ Missing environment variables: ${missing.join(', ')}. ` +
        `Please configure them in your .env.local file.`
      );
    }
  }
}

export default env;
