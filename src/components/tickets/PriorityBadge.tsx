import React from 'react';
import { cn } from '@/utils/cn';
import { TicketPriority } from '@/types';
import { AlertTriangle, ArrowUp, Minus, ArrowDown, LucideIcon } from 'lucide-react';

export interface PriorityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  priority: TicketPriority;
  size?: 'sm' | 'md';
  priorityScore?: number;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm', priorityScore, className, ...props }) => {
  const config: Record<TicketPriority, { classes: string; icon: LucideIcon; dot?: boolean }> = {
    [TicketPriority.CRITICAL]: {
      classes: 'bg-red-50 text-red-600 border border-red-200/80 font-bold shadow-sm',
      icon: AlertTriangle,
      dot: true,
    },
    [TicketPriority.HIGH]: {
      classes: 'bg-orange-50 text-orange-600 border border-orange-200/80 font-semibold',
      icon: ArrowUp,
      dot: false,
    },
    [TicketPriority.MEDIUM]: {
      classes: 'bg-amber-50 text-amber-700 border border-amber-200/80 font-medium',
      icon: Minus,
      dot: false,
    },
    [TicketPriority.LOW]: {
      classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium',
      icon: ArrowDown,
      dot: false,
    },
  };

  const { classes, icon: Icon, dot } = config[priority] || config[TicketPriority.MEDIUM];

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-sm px-3 py-1 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        classes,
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="flex w-1.5 h-1.5 relative mr-0.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-red-600" />
        </span>
      )}
      <Icon className={iconSizes[size]} />
      <span>
        {priority}
        {priorityScore !== undefined && ` (${priorityScore})`}
      </span>
    </span>
  );
};
