import { z } from 'zod';
import { LaunchSchema, type Launch, type LaunchSubmission } from '../types';

// API response schemas
export const LaunchesResponseSchema = z.object({
  launches: z.array(LaunchSchema),
  total: z.number(),
});

export type LaunchesResponse = z.infer<typeof LaunchesResponseSchema>;

// Data access functions using centralized API
export async function getAllLaunches(): Promise<z.infer<typeof LaunchesResponseSchema>> {
  try {
    const response = await fetch('/api/launches', {
      cache: 'no-store', // Always get fresh data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return LaunchesResponseSchema.parse(data);
  } catch (error) {
    console.error('Failed to fetch launches:', error);
    return { launches: [], total: 0 };
  }
}

export async function submitLaunch(submission: LaunchSubmission): Promise<z.infer<typeof LaunchSchema>> {
  try {
    const response = await fetch('/api/launches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const newLaunch = await response.json();
    return LaunchSchema.parse(newLaunch);
  } catch (error) {
    console.error('Failed to submit launch:', error);
    throw error; // Re-throw to let the UI handle the error
  }
} 