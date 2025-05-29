import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema - matches the table structure
export const DatabaseLaunchSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  url: z.string().url(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  tweet_url: z.string().nullable().optional(),
  submitted_at: z.string(),
  created_at: z.string(),
});

export type DatabaseLaunch = z.infer<typeof DatabaseLaunchSchema>; 