import { useState, useEffect } from 'react';
import { z } from 'zod';
import { getAllLaunches } from '../../../api/launches';
import { LaunchSchema } from '../../../types';

// Hook return type interface
interface FeedDataReturn {
  launches: z.infer<typeof LaunchSchema>[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// Hook for managing feed data state
export function useFeedData(): FeedDataReturn {
  const [launches, setLaunches] = useState<z.infer<typeof LaunchSchema>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLaunches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllLaunches();
      setLaunches(response.launches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch launches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaunches();
  }, []);

  // Refresh data when window gains focus (user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      fetchLaunches();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return {
    launches,
    isLoading,
    error,
    refresh: fetchLaunches,
  };
} 