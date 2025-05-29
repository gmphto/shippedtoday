'use client';

import { z } from 'zod';
import { useSubmitForm } from './hooks/useSubmitForm';
import { SubmitForm } from './components/SubmitForm';
import { SubmitSuccess } from './components/SubmitSuccess';

export const SubmitPropsSchema = z.object({
  className: z.string().optional(),
});

type SubmitProps = z.infer<typeof SubmitPropsSchema>;

export function Submit({ className = '' }: SubmitProps) {
  const { isSubmitted, submittedLaunch } = useSubmitForm();

  if (isSubmitted && submittedLaunch) {
    return <SubmitSuccess launch={submittedLaunch} className={className} />;
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submit Your Launch
        </h1>
        <p className="text-gray-600">
          Share what you've shipped with the community
        </p>
      </div>
      
      <SubmitForm />
    </div>
  );
} 