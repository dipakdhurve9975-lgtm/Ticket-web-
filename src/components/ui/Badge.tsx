import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', showDot, children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface-100 text-surface-800',
      primary: 'bg-brand-100 text-brand-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    };

    const dotVariants = {
      default: 'bg-surface-500',
      primary: 'bg-brand-500',
      success: 'bg-green-500',
      warning: 'bg-amber-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
    };

    const sizes = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-1',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {showDot && (
          <span className="flex w-1.5 h-1.5 mr-1.5 rounded-full relative">
            <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping", dotVariants[variant])}></span>
            <span className={cn("relative inline-flex rounded-full w-1.5 h-1.5", dotVariants[variant])}></span>
          </span>
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
