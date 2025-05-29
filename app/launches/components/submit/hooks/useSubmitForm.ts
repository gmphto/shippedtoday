'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { submitLaunch } from '../../../api/launches';
import { LaunchSubmissionSchema, LaunchSchema, type LaunchSubmission } from '../../../types';

// Hook return type interface
interface SubmitFormReturn {
  isSubmitting: boolean;
  isSubmitted: boolean;
  submittedLaunch: z.infer<typeof LaunchSchema> | null;
  error: string | null;
  handleSubmit: (data: LaunchSubmission) => Promise<void>;
  reset: () => void;
}

// Hook for managing submit form state
export function useSubmitForm(): SubmitFormReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedLaunch, setSubmittedLaunch] = useState<z.infer<typeof LaunchSchema> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: LaunchSubmission): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate submission data
      const validatedData = LaunchSubmissionSchema.parse(data);
      
      // Submit launch
      const newLaunch = await submitLaunch(validatedData);
      
      setSubmittedLaunch(newLaunch);
      setIsSubmitted(true);
      
      // Auto-navigate back to launches after a brief delay to show success
      setTimeout(() => {
        router.push('/');
      }, 2000); // 2 second delay to show success message
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit launch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = (): void => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    setSubmittedLaunch(null);
    setError(null);
  };

  return {
    isSubmitting,
    isSubmitted,
    submittedLaunch,
    error,
    handleSubmit,
    reset,
  };
} 