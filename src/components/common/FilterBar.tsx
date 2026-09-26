import React from 'react';
import { cn } from '@/utils/cn';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { TicketFilters, TicketStatus, TicketPriority } from '@/types';
import { TICKET_CATEGORIES, DEPARTMENTS } from '@/config/constants';

export interface FilterBarProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFiltersChange, 
  className 
}) => {
  const activeCount = Object.values(filters).filter(val => val !== undefined && val !== '').length;

  const handleFilterChange = (key: keyof TicketFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <div className="flex flex-wrap items-center gap-4 flex-1">
        <div className="w-full sm:w-40">
          <Select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              ...Object.values(TicketStatus).map(status => ({ value: status, label: status }))
            ]}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            options={[
              { value: '', label: 'All Priorities' },
              ...Object.values(TicketPriority).map(priority => ({ value: priority, label: priority }))
            ]}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...TICKET_CATEGORIES.map((category: string) => ({ value: category, label: category }))
            ]}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={filters.department || ''}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            options={[
              { value: '', label: 'All Departments' },
              ...DEPARTMENTS.map(dept => ({ value: dept, label: dept }))
            ]}
          />
        </div>
      </div>
      
      {activeCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-surface-500">{activeCount} active</span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};
