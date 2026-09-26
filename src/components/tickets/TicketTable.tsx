import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  MoreVertical,
  Eye,
  UserPlus,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatters';
import { TicketStatus, type Ticket } from '@/types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { Dropdown } from '@/components/ui/Dropdown';

export type SortField = 'id' | 'title' | 'priorityScore' | 'status' | 'createdAt' | 'dueAt';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface TicketTableProps {
  tickets: Ticket[];
  onSort?: (field: SortField, direction: SortDirection) => void;
  sortConfig?: SortConfig;
  onRowClick?: (ticket: Ticket) => void;
  onAssign?: (ticket: Ticket) => void;
  onChangeStatus?: (ticket: Ticket, newStatus: TicketStatus) => void;
  isLoading?: boolean;
}

export function TicketTable({ 
  tickets, 
  onSort, 
  sortConfig, 
  onRowClick,
  onAssign,
  onChangeStatus,
  isLoading 
}: TicketTableProps) {
  const navigate = useNavigate();

  const handleSort = (field: SortField) => {
    if (!onSort) return;
    
    if (sortConfig?.field === field) {
      onSort(field, sortConfig.direction === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig?.field !== field) return <ArrowUpDown className="w-4 h-4 ml-1 text-surface-400" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 text-brand-600" />
      : <ArrowDown className="w-4 h-4 ml-1 text-brand-600" />;
  };

  const SortableHeader = ({ field, label, className }: { field: SortField, label: string, className?: string }) => (
    <th 
      className={cn(
        "px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors",
        className
      )}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        {getSortIcon(field)}
      </div>
    </th>
  );

  const isOverdue = (ticket: Ticket) => {
    if (!ticket.dueAt || ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') return false;
    return new Date(ticket.dueAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
        <div className="animate-pulse flex flex-col">
          <div className="h-12 bg-surface-50 border-b border-surface-200" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 border-b border-surface-100" />
          ))}
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-surface-200 p-8 text-center text-surface-500">
        No tickets found.
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-surface-200 overflow-x-auto scrollbar-thin">
      <table className="w-full whitespace-nowrap">
        <thead className="bg-surface-50 border-b border-surface-200">
          <tr>
            <SortableHeader field="id" label="ID" className="w-20" />
            <SortableHeader field="title" label="Title" className="max-w-xs" />
            <SortableHeader field="priorityScore" label="Priority" />
            <SortableHeader field="status" label="Status" />
            <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden md:table-cell">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden lg:table-cell">Department</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden xl:table-cell">Requester</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden lg:table-cell">Assigned To</th>
            <SortableHeader field="createdAt" label="Created" className="hidden sm:table-cell" />
            <th className="px-4 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {tickets.map((ticket) => {
            const overdue = isOverdue(ticket);
            return (
              <tr 
                key={ticket.id}
                onClick={(e) => {
                  // Prevent navigation if clicking on actions dropdown
                  if ((e.target as HTMLElement).closest('.actions-cell')) return;
                  if (onRowClick) {
                    onRowClick(ticket);
                  } else {
                    navigate(`/tickets/${ticket.id}`);
                  }
                }}
                className={cn(
                  "hover:bg-surface-50 transition-colors cursor-pointer group",
                  overdue && "border-l-4 border-l-red-500"
                )}
              >
                <td className="px-4 py-4 text-sm font-medium text-surface-900">
                  #{ticket.id.substring(0, 8)}
                </td>
                <td className="px-4 py-4 text-sm text-surface-900 max-w-xs truncate">
                  {ticket.title}
                </td>
                <td className="px-4 py-4 text-sm">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-4 py-4 text-sm">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-4 text-sm text-surface-500 hidden md:table-cell">
                  {ticket.category}
                </td>
                <td className="px-4 py-4 text-sm text-surface-500 hidden lg:table-cell">
                  {ticket.department}
                </td>
                <td className="px-4 py-4 text-sm text-surface-500 hidden xl:table-cell">
                  {ticket.requester}
                </td>
                <td className="px-4 py-4 text-sm hidden lg:table-cell">
                  {ticket.assignedToName ? (
                    <span className="text-surface-700">{ticket.assignedToName}</span>
                  ) : (
                    <span className="text-surface-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-surface-500 hidden sm:table-cell">
                  {formatDate(ticket.createdAt)}
                </td>
                <td className="px-4 py-4 text-sm text-right actions-cell">
                  <div className="flex justify-end relative">
                    <Dropdown
                      trigger={
                        <button className="p-1 rounded hover:bg-surface-200 text-surface-500 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      }
                      items={[
                        {
                          label: 'View Details',
                          icon: Eye,
                          onClick: () => navigate(`/tickets/${ticket.id}`)
                        },
                        {
                          label: 'Assign to Me',
                          icon: UserPlus,
                          onClick: () => onAssign && onAssign(ticket),
                          disabled: ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                        },
                        {
                          label: 'Mark In Progress',
                          icon: RefreshCw,
                          onClick: () => onChangeStatus && onChangeStatus(ticket, TicketStatus.IN_PROGRESS),
                          disabled: ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                        }
                      ]}
                      align="right"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
