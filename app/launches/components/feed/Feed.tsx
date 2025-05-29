'use client';

import { z } from 'zod';
import { useMemo } from 'react';
import { useFeedData } from './hooks/useFeedData';
import { FeedItem } from './components/FeedItem';
import { FeedEmpty } from './components/FeedEmpty';
import { FeedLoading } from './components/FeedLoading';

export const FeedPropsSchema = z.object({
  className: z.string().optional(),
});

type FeedProps = z.infer<typeof FeedPropsSchema>;

export function Feed({ className = '' }: FeedProps) {
  const { launches, isLoading, error } = useFeedData();

  const content = useMemo(() => {
    if (isLoading) return <FeedLoading />;
    if (error) return <div className="text-red-600 p-4">Failed to load launches</div>;
    if (launches.length === 0) return <FeedEmpty />;

    return (
      <div className="space-y-4">
        {launches.map(launch => (
          <FeedItem key={launch.id} launch={launch} />
        ))}
      </div>
    );
  }, [launches, isLoading, error]);

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recent Launches
        </h1>
        <p className="text-gray-600">
          Discover what the community shipped today
        </p>
      </div>
      
      {content}
    </div>
  );
} 