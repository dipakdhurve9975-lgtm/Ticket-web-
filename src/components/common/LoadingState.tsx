import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div 
      className={cn("flex flex-col items-center justify-center p-8 text-center space-y-4", className)} 
      {...props}
    >
      <Loader2 className={cn("animate-spin text-brand-600", iconSizes[size])} />
      {message && <p className="text-sm text-surface-500">{message}</p>}
    </div>
  );
};
