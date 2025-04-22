import React from 'react';
import { CalendarDays } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface SystemUpdatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Update {
  date: string;
  version: string;
  changes: {
    title: string;
    description: string;
    type: 'feature' | 'enhancement' | 'policy';
  }[];
}

const updates: Update[] = [
  {
    date: 'January 28, 2023',
    version: '1.2.0',
    changes: [
      {
        title: 'Profile Page Launch',
        description: 'New dedicated profile page for players to manage their information.',
        type: 'feature'
      },
      {
        title: 'Court Booking Policy Update',
        description: 'Implemented new 48-hour advance booking policy with maximum 1 court per reservation.',
        type: 'policy'
      },
      {
        title: 'Performance Optimization',
        description: 'Enhanced system response time by 40% through database query optimization.',
        type: 'enhancement'
      }
    ]
  },
  {
    date: 'December 27, 2024',
    version: '1.1.5',
    changes: [
      {
        title: 'Real-time Court Availability',
        description: 'Added live court status updates with automatic refresh every 60 seconds.',
        type: 'feature'
      },
      {
        title: 'Mobile Responsiveness',
        description: 'Improved mobile layout and touch interactions for better user experience.',
        type: 'enhancement'
      }
    ]
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'feature':
      return 'bg-blue-100 text-blue-800';
    case 'enhancement':
      return 'bg-green-100 text-green-800';
    case 'policy':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function SystemUpdatesDialog({ isOpen, onClose }: SystemUpdatesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">What&apos;s New</DialogTitle>
          <DialogDescription className="text-base">
            Latest updates and improvements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {updates.map((update, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-600">{update.date}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="font-mono text-sm text-gray-500">v{update.version}</span>
              </div>

              <div className="space-y-4">
                {update.changes.map((change, changeIndex) => (
                  <div key={changeIndex} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(change.type)}`}>
                        {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                      </span>
                      <h4 className="text-base font-semibold">{change.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-0">{change.description}</p>
                  </div>
                ))}
              </div>

              {index < updates.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}