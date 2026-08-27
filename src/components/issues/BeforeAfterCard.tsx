import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CampusImprovement } from '@/lib/types/issues';
import { format } from 'date-fns';
import { CheckCircle, MapPin } from 'lucide-react';

interface BeforeAfterCardProps {
  improvement: CampusImprovement;
}

export const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({ improvement }) => {
  return (
    <Card className="overflow-hidden border-gray-100 hover:shadow-lg transition-shadow bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Before */}
        <div className="relative group">
          <div className="absolute top-4 left-4 z-10 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
            Before
          </div>
          <div className="h-64 md:h-full relative overflow-hidden">
            <img 
              src={improvement.beforeImage} 
              alt="Before improvement" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm line-clamp-2">{improvement.originalDescription}</p>
            </div>
          </div>
        </div>

        {/* After */}
        <div className="relative group">
          <div className="absolute top-4 left-4 z-10 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
            After
          </div>
          <div className="h-64 md:h-full relative overflow-hidden">
            <img 
              src={improvement.afterImage} 
              alt="After improvement" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm line-clamp-2 font-medium">{improvement.resolutionDescription}</p>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex items-center text-sm text-gray-600">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
          <span>Resolved by <span className="font-semibold text-gray-900">{improvement.department}</span></span>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
          {format(new Date(improvement.dateResolved), 'MMMM d, yyyy')}
        </div>
      </CardContent>
    </Card>
  );
};
