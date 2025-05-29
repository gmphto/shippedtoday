import { z } from 'zod';
import { LaunchSchema, type Launch, type LaunchSubmission } from '../types';
import { supabase, DatabaseLaunchSchema } from './supabase';

// API response schemas
export const LaunchesResponseSchema = z.object({
  launches: z.array(LaunchSchema),
  total: z.number(),
});

export type LaunchesResponse = z.infer<typeof LaunchesResponseSchema>;

// Pure function to convert database launch to app launch
// Pure function
function convertDatabaseLaunchToLaunch(dbLaunch: any): z.infer<typeof LaunchSchema> {
  return {
    id: dbLaunch.id,
    title: dbLaunch.title,
    url: dbLaunch.url,
    description: dbLaunch.description,
    tags: dbLaunch.tags || [],
    submittedAt: dbLaunch.submitted_at,
  };
}

// Data access functions using Supabase
export async function getAllLaunches(): Promise<z.infer<typeof LaunchesResponseSchema>> {
  try {
    console.log('📡 Fetching launches from Supabase...');
    
    const { data, error } = await supabase
      .from('launches')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      console.log('📭 No launches found');
      return { launches: [], total: 0 };
    }

    console.log(`✅ Fetched ${data.length} launches from Supabase`);
    
    // Convert database format to app format
    const launches = data.map(convertDatabaseLaunchToLaunch);
    
    return { launches, total: launches.length };
  } catch (error) {
    console.error('💥 Failed to fetch launches:', error);
    return { launches: [], total: 0 };
  }
}

export async function submitLaunch(submission: LaunchSubmission): Promise<z.infer<typeof LaunchSchema>> {
  console.log('📤 submitLaunch called with:', submission);
  
  try {
    const { data, error } = await supabase
      .from('launches')
      .insert([
        {
          title: submission.title,
          url: submission.url,
          description: submission.description,
          tags: submission.tags,
          tweet_url: submission.tweetUrl || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from database');
    }

    console.log('✅ Successfully created launch in Supabase:', data);
    
    // Convert database format to app format
    const newLaunch = convertDatabaseLaunchToLaunch(data);
    return LaunchSchema.parse(newLaunch);
  } catch (error) {
    console.error('💥 Failed to submit launch:', error);
    throw error; // Re-throw to let the UI handle the error
  }
} 