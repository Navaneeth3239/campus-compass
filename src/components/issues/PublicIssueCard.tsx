import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Issue } from '@/lib/types/issues';
import { IssueStatusBadge } from './IssueStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

interface PublicIssueCardProps {
  issue: Issue;
}

export const PublicIssueCard: React.FC<PublicIssueCardProps> = ({ issue }) => {
  const displayTitle = issue.publicTitle || issue.title;
  const displayDescription = issue.publicDescription || issue.description;
  const displayImage = issue.publicImages?.[0] || issue.images?.[0];

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md border-gray-100 hover:border-gray-200 bg-white">
      {displayImage ? (
        <div className="relative h-48 w-full bg-gray-100">
          <img
            src={displayImage}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <PriorityBadge priority={issue.priority} />
          </div>
        </div>
      ) : (
        <div className="relative h-48 w-full bg-gray-50 flex items-center justify-center border-b border-gray-100">
          <ImageIcon className="w-12 h-12 text-gray-300" />
          <div className="absolute top-3 right-3 flex gap-2">
            <PriorityBadge priority={issue.priority} />
          </div>
        </div>
      )}

      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{issue.category.replace('_', ' ')}</div>
          <IssueStatusBadge status={issue.status} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 leading-tight line-clamp-2">
          {displayTitle}
        </h3>
      </CardHeader>

      <CardContent className="px-5 pb-4 flex-grow">
        <p className="text-gray-600 line-clamp-3 text-sm mb-4">
          {displayDescription}
        </p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{issue.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{format(new Date(issue.dateReported), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0 mt-auto">
        <Link 
          to="/issues/$id" 
          params={{ id: issue.id }}
          className="w-full py-2.5 px-4 bg-gray-50 hover:bg-green-50 text-green-700 hover:text-green-800 font-medium rounded-lg text-center transition-colors border border-gray-200 hover:border-green-200"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};
