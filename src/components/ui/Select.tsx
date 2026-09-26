import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-surface-700">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "flex w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-surface-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-surface-300",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-surface-400">
            <ChevronDown className="h-4 w-4" />
          </div>
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
Select.displayName = 'Select';
