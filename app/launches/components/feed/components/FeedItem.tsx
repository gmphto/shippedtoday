import { z } from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { LaunchSchema } from '../../../types';

export const FeedItemPropsSchema = z.object({
  launch: LaunchSchema,
  className: z.string().optional(),
});

type FeedItemProps = z.infer<typeof FeedItemPropsSchema>;

export function FeedItem({ launch, className = '' }: FeedItemProps) {
  const timeAgo = formatDistanceToNow(new Date(launch.submittedAt), { addSuffix: true });

  return (
    <article className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 leading-tight">
            <a 
              href={launch.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-600 transition-colors"
            >
              {launch.title}
            </a>
          </h2>
          <time 
            className="text-sm text-gray-500 whitespace-nowrap"
            dateTime={launch.submittedAt}
          >
            {timeAgo}
          </time>
        </div>

        <p className="text-gray-700 leading-relaxed">
          {launch.description}
        </p>

        {launch.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
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

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <a 
            href={launch.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-600 transition-colors truncate"
          >
            {launch.url}
          </a>
        </div>
      </div>
    </article>
  );
} 