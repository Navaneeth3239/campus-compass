import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IssueStatus } from '@/lib/types/issues';
import { AlertCircle, CheckCircle2, Clock, CheckSquare, Search, Truck, Wrench } from 'lucide-react';

interface IssueStatusBadgeProps {
  status: IssueStatus;
}

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'REPORTED':
        return { label: 'Reported', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200', icon: <AlertCircle className="w-3 h-3 mr-1" /> };
      case 'REVIEWED':
        return { label: 'Reviewed', className: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200', icon: <Search className="w-3 h-3 mr-1" /> };
      case 'ASSIGNED':
        return { label: 'Assigned', className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200', icon: <CheckSquare className="w-3 h-3 mr-1" /> };
      case 'IN_PROGRESS':
        return { label: 'In Progress', className: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200', icon: <Wrench className="w-3 h-3 mr-1" /> };
      case 'RESOLVED':
        return { label: 'Resolved', className: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> };
      case 'VERIFIED':
        return { label: 'Verified', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> };
      case 'CLOSED':
        return { label: 'Closed', className: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200', icon: <Clock className="w-3 h-3 mr-1" /> };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200', icon: <AlertCircle className="w-3 h-3 mr-1" /> };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant="outline" className={`flex items-center w-fit ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};
