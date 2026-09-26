import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

export interface DropdownItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right', className }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-2xl border border-surface-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 shadow-2xl animate-in fade-in zoom-in-95 duration-100 focus:outline-none overflow-hidden",
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          )}
        >
          <div className="py-1.5 divide-y divide-surface-100 dark:divide-charcoal-800">
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="my-1 border-t border-surface-200 dark:border-charcoal-700" />;
              }
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left flex items-center px-4 py-2.5 text-sm transition-colors cursor-pointer",
                    item.disabled && "opacity-50 cursor-not-allowed",
                    !item.disabled && !item.danger && "text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-charcoal-800 hover:text-surface-900 dark:hover:text-white font-medium",
                    !item.disabled && item.danger && "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium",
                  )}
                >
                  {Icon && <Icon className="mr-2.5 h-4 w-4" />}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
