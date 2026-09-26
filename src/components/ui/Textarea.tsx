import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-surface-700">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            "flex w-full rounded-lg border bg-white px-3 py-2 text-sm text-surface-900 transition-colors placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-surface-300",
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn("text-sm", error ? "text-red-500" : "text-surface-500")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
