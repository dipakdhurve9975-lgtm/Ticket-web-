import React from 'react';
import { cn } from '@/utils/cn';
import { TicketStatus } from '@/types';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className, ...props }) => {
  const config = {
    [TicketStatus.OPEN]: {
      classes: 'bg-status-open-bg text-status-open',
      dot: 'bg-status-open',
      label: 'Open',
    },
    [TicketStatus.IN_PROGRESS]: {
      classes: 'bg-status-in-progress-bg text-status-in-progress',
      dot: 'bg-status-in-progress',
      label: 'In Progress',
    },
    [TicketStatus.WAITING]: {
      classes: 'bg-status-waiting-bg text-status-waiting',
      dot: 'bg-status-waiting',
      label: 'Waiting',
    },
    [TicketStatus.RESOLVED]: {
      classes: 'bg-status-resolved-bg text-status-resolved',
      dot: 'bg-status-resolved',
      label: 'Resolved',
    },
    [TicketStatus.CLOSED]: {
      classes: 'bg-status-closed-bg text-status-closed',
      dot: 'bg-status-closed',
      label: 'Closed',
    },
  };

  const { classes, dot, label } = config[status] || config[TicketStatus.OPEN];

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        classes,
        sizes[size],
        className
      )}
      {...props}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
};
