import React from 'react';
import { cn } from '@/utils/cn';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className 
}) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        iconLeft={<Search className="h-4 w-4" />}
        className={value ? "pr-10" : ""}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
