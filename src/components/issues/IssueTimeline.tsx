import React from 'react';
import { IssueTimelineEvent } from '@/lib/types/issues';
import { IssueStatusBadge } from './IssueStatusBadge';
import { format } from 'date-fns';

interface IssueTimelineProps {
  timeline: IssueTimelineEvent[];
}

export const IssueTimeline: React.FC<IssueTimelineProps> = ({ timeline }) => {
  // Sort timeline by date descending (newest first)
  const sortedTimeline = [...timeline].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
      {sortedTimeline.map((event, index) => (
        <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-50 text-green-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <IssueStatusBadge status={event.status} />
              <time className="text-xs font-medium text-gray-500">
                {format(new Date(event.date), 'MMM d, yyyy • h:mm a')}
              </time>
            </div>
            <p className="text-sm text-gray-600">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
