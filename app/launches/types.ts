import { z } from 'zod';

// Domain schemas
export const LaunchSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()),
  submittedAt: z.string(), // ISO date string
});

export const LaunchSubmissionSchema = z.object({
  tweetUrl: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().url('Must be a valid tweet URL').optional()
  ),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).default([]),
});

// Domain types derived from schemas
export type Launch = z.infer<typeof LaunchSchema>;
export type LaunchSubmission = z.infer<typeof LaunchSubmissionSchema>; 