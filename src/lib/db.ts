import { neon } from '@neondatabase/serverless';
import { env } from '@/lib/env';

export function getDb() {
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(databaseUrl);
}

