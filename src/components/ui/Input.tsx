import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, iconLeft, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-surface-700">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
              {iconLeft}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "flex w-full rounded-lg border bg-white px-3 py-2 text-sm text-surface-900 transition-colors placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-surface-300",
              iconLeft && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p className={cn("text-sm", error ? "text-red-500" : "text-surface-500")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
