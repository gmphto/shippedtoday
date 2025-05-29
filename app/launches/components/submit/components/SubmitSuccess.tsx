'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { LaunchSchema } from '../../../types';

export const SubmitSuccessPropsSchema = z.object({
  launch: LaunchSchema,
  className: z.string().optional(),
});

type SubmitSuccessProps = z.infer<typeof SubmitSuccessPropsSchema>;

export function SubmitSuccess({ launch, className = '' }: SubmitSuccessProps) {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Launch Submitted Successfully!
        </h2>

        <p className="text-gray-600 mb-4">
          Thank you for sharing "{launch.title}" with the community.
        </p>

        {countdown > 0 ? (
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Redirecting to launches in {countdown} second{countdown !== 1 ? 's' : ''}...
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
              Redirecting now...
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Your submission:</h3>
          <p className="text-gray-700 mb-2">{launch.description}</p>
          <a 
            href={launch.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            {launch.url}
          </a>
          
          {launch.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {launch.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <a 
            href="/" 
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            View All Launches
          </a>
          <a 
            href="/submit" 
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Submit Another
          </a>
        </div>
      </div>
    </div>
  );
} 