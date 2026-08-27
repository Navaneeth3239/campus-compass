import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IssuePriority } from '@/lib/types/issues';
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: IssuePriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'LOW':
        return { label: 'Low', className: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200', icon: <ArrowDown className="w-3 h-3 mr-1" /> };
      case 'MEDIUM':
        return { label: 'Medium', className: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200', icon: <ArrowRight className="w-3 h-3 mr-1" /> };
      case 'HIGH':
        return { label: 'High', className: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200', icon: <ArrowUp className="w-3 h-3 mr-1" /> };
      default:
        return { label: priority, className: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200', icon: <ArrowRight className="w-3 h-3 mr-1" /> };
    }
  };

  const config = getPriorityConfig();

  return (
    <Badge variant="outline" className={`flex items-center w-fit ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};
