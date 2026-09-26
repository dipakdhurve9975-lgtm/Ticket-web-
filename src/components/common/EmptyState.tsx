import React from 'react';
import { cn } from '@/utils/cn';
import { Inbox } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  action, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn("flex flex-col items-center justify-center p-8 text-center", className)} 
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 mb-4">
        <Icon className="h-6 w-6 text-surface-500" />
      </div>
      <h3 className="text-lg font-medium text-surface-900 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
};
