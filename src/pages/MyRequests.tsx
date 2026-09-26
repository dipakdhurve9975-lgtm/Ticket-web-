import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutList, Table as TableIcon } from 'lucide-react';
import { ticketService } from '@/services/ticketService';
import { ROUTES, getTicketDetailsPath } from '@/config/routes';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { formatDate } from '@/utils/formatters';
import type { Ticket, TicketFilters } from '@/types';

export const MyRequests: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<TicketFilters>({});
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getMyTickets();
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <LoadingState message="Loading your requests..." />;

  const filteredTickets = tickets.filter(ticket => {
    if (search) {
      const q = search.toLowerCase();
      const match = 
        ticket.title.toLowerCase().includes(q) ||
        ticket.id.toLowerCase().includes(q) ||
        ticket.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.status && !filters.status.includes(ticket.status)) {
      return false;
    }
    if (filters.priority && !filters.priority.includes(ticket.priority)) {
      return false;
    }
    if (filters.category && ticket.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    return true;
  });

  const renderListView = () => (
    <div className="space-y-4">
      {filteredTickets.map((ticket) => (
        <Card 
          key={ticket.id} 
          className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-brand-500"
          onClick={() => navigate(getTicketDetailsPath(ticket.id))}
        >
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold font-mono text-surface-500">{ticket.id}</span>
                <span className="text-xs font-medium px-2 py-0.5 bg-surface-100 text-surface-700 rounded-full">
                  {ticket.category}
                </span>
              </div>
              <h3 className="text-base font-semibold text-surface-900 truncate mb-2">
                {ticket.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-500">
                <span>Created {formatDate(ticket.createdAt)}</span>
                <span>•</span>
                <span>{ticket.department}</span>
                {ticket.assignedToName && (
                  <>
                    <span>•</span>
                    <span>Assigned to {ticket.assignedToName}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <PriorityBadge priority={ticket.priority} priorityScore={ticket.priorityScore} />
              <StatusBadge status={ticket.status} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto bg-white rounded-lg border border-surface-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-50 text-surface-600 font-semibold border-b border-surface-200">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Priority</th>
            <th className="p-4">Status</th>
            <th className="p-4">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {filteredTickets.map((ticket) => (
            <tr 
              key={ticket.id} 
              className="hover:bg-surface-50 cursor-pointer"
              onClick={() => navigate(getTicketDetailsPath(ticket.id))}
            >
              <td className="p-4 font-mono font-medium text-surface-600">{ticket.id}</td>
              <td className="p-4 font-semibold text-surface-900 max-w-xs truncate">{ticket.title}</td>
              <td className="p-4 text-surface-600">{ticket.category}</td>
              <td className="p-4">
                <PriorityBadge priority={ticket.priority} priorityScore={ticket.priorityScore} />
              </td>
              <td className="p-4">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="p-4 text-surface-500">{formatDate(ticket.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Requests</h1>
          <p className="text-surface-500 mt-1">Track and view all your submitted support tickets.</p>
        </div>
        <Button onClick={() => navigate(ROUTES.CREATE_REQUEST)} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold">
          Create New Request
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search by ID, title, or category..." 
          />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <FilterBar filters={filters} onFiltersChange={setFilters} />
          <div className="flex items-center bg-surface-100 rounded-lg p-1 border border-surface-200">
            <button 
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-600 font-bold' : 'text-surface-500 hover:text-surface-700'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white shadow-sm text-brand-600 font-bold' : 'text-surface-500 hover:text-surface-700'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredTickets.length > 0 ? (
        viewMode === 'list' ? renderListView() : renderTableView()
      ) : (
        <EmptyState
          title="No requests found"
          description="You don't have any support tickets matching the selected filters."
          action={{
            label: 'Create Request',
            onClick: () => navigate(ROUTES.CREATE_REQUEST)
          }}
        />
      )}
    </div>
  );
};
