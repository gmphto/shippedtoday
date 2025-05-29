import { z } from 'zod';

export const FeedEmptyPropsSchema = z.object({
  className: z.string().optional(),
});

type FeedEmptyProps = z.infer<typeof FeedEmptyPropsSchema>;

export function FeedEmpty({ className = '' }: FeedEmptyProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No launches yet
        </h3>
        
        <p className="text-gray-600 mb-6">
          Be the first to share what you've shipped today!
        </p>
        
        <a 
          href="/submit" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Submit Your Launch
        </a>
      </div>
    </div>
  );
} 