import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Clock, CheckCircle, Timer } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ticketService } from '@/services/ticketService';
import { ROUTES, getTicketDetailsPath } from '@/config/routes';
import { StatCard } from '@/components/charts/StatCard';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/utils/formatters';
import { TicketStatus, type Ticket, type DashboardStats } from '@/types';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [needsAttention, setNeedsAttention] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await ticketService.getDashboardStats();
        setStats(dashboardStats);
        
        const tickets = await ticketService.getMyTickets(user?.id);
        setRecentTickets(tickets.slice(0, 5));
        
        // Filter needs attention logic
        const attention = tickets.filter(t => 
          t.status === TicketStatus.WAITING || 
          (t.status !== TicketStatus.RESOLVED && t.status !== TicketStatus.CLOSED && t.dueAt && new Date(t.dueAt) < new Date())
        );
        setNeedsAttention(attention);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <LoadingState message="Loading dashboard..." />;

  const formatResolutionTime = (hours?: number) => {
    if (!hours) return 'N/A';
    if (hours < 1) return `${Math.round(hours * 60)} mins`;
    return `${hours.toFixed(1)} hrs`;
  };

  const renderTicketCard = (ticket: Ticket) => (
    <Card 
      key={ticket.id} 
      className="mb-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-brand-500"
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
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-surface-500 mt-1">Here's an overview of your support requests.</p>
        </div>
        <Button onClick={() => navigate(ROUTES.CREATE_REQUEST)}>
          Create New Request
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Open Requests"
            value={stats.openTickets.toString()}
            icon={Inbox}
            iconColor="text-brand-600 bg-brand-50"
            change={{ value: 12, type: 'increase' }}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgressTickets.toString()}
            icon={Clock}
            iconColor="text-purple-600 bg-purple-50"
          />
          <StatCard
            title="Resolved This Week"
            value={stats.resolvedTickets.toString()}
            icon={CheckCircle}
            iconColor="text-green-600 bg-green-50"
            change={{ value: 5, type: 'increase' }}
          />
          <StatCard
            title="Avg Resolution Time"
            value={formatResolutionTime(stats.averageResolutionTime)}
            icon={Timer}
            iconColor="text-blue-600 bg-blue-50"
          />
        </div>
      )}

      {needsAttention.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Needs Attention
          </h2>
          <div className="space-y-3">
            {needsAttention.map(renderTicketCard)}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">My Recent Requests</h2>
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.MY_REQUESTS)}>
            View All
          </Button>
        </div>
        {recentTickets.length > 0 ? (
          <div className="space-y-3">
            {recentTickets.map(renderTicketCard)}
          </div>
        ) : (
          <EmptyState
            title="No requests yet"
            description="You haven't created any support requests. When you do, they will appear here."
            action={{
              label: 'Create Request',
              onClick: () => navigate(ROUTES.CREATE_REQUEST)
            }}
          />
        )}
      </div>
    </div>
  );
};
