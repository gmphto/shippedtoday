import { z } from 'zod';

export const FeedLoadingPropsSchema = z.object({
  className: z.string().optional(),
});

type FeedLoadingProps = z.infer<typeof FeedLoadingPropsSchema>;

export function FeedLoading({ className = '' }: FeedLoadingProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(3)].map((_, index) => (
        <div 
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>

            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 