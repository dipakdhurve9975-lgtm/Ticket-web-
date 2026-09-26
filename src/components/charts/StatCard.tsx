import React from 'react';
import { cn } from '@/utils/cn';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-brand-600 bg-brand-100",
  description,
  className,
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-surface-500">{title}</p>
          <div className={cn("p-2 rounded-full", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900">{value}</h2>
        </div>
        {(change || description) && (
          <div className="mt-2 flex items-center text-sm">
            {change && (
              <span
                className={cn(
                  "flex items-center font-medium",
                  change.type === 'increase' ? "text-green-600" : "text-red-600"
                )}
              >
                {change.type === 'increase' ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {change.value}%
              </span>
            )}
            {description && (
              <span className="ml-2 text-surface-500">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
