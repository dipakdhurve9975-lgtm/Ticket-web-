import React from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = 'Something went wrong', 
  message, 
  onRetry, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn("flex flex-col items-center justify-center p-8 text-center", className)} 
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-surface-900 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
};
