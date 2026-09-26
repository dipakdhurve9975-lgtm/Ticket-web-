import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ticketService } from '@/services/ticketService';
import { useAuth } from '@/hooks/useAuth';
import type { Ticket, DashboardStats } from '@/types';
import { TicketTable } from '@/components/tickets/TicketTable';
import { StatCard } from '@/components/charts/StatCard';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/common/LoadingState';
import { ROUTES } from '@/config/routes';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { formatDate } from '@/utils/formatters';

export function AgentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([]);
  const [criticalTickets, setCriticalTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        if (!user) return;
        
        // Fetch data
        const assigned = await ticketService.getAssignedTickets(user.id);
        const allTicketsResult = await ticketService.getTickets();
        const dashboardStats = await ticketService.getDashboardStats();
        
        // Process unassigned critical tickets
        const criticalUnassigned = allTicketsResult.data
          .filter(t => t.priority === 'CRITICAL' && !t.assignedTo && (t.status === 'OPEN' || t.status === 'IN_PROGRESS'))
          .sort((a, b) => b.priorityScore - a.priorityScore)
          .slice(0, 5);

        setAssignedTickets(assigned.filter(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED'));
        setCriticalTickets(criticalUnassigned);
        setStats(dashboardStats);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading || !stats) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const myOpenTicketsCount = assignedTickets.length;
  // Calculate resolved today by this agent (mock logic)
  const resolvedToday = Math.floor(stats.ticketsToday * 0.4); 

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900">
            Welcome back, {user?.name.split(' ')[0] || 'Agent'}
          </h1>
          <p className="text-surface-500 mt-1">
            Here's what needs your attention today. You have {myOpenTicketsCount} active tickets assigned.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            onClick={() => navigate(ROUTES.PRIORITY_QUEUE)}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>Priority Queue</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Assigned to Me" 
          value={myOpenTicketsCount} 
          icon={User}
          iconColor="text-brand-600 bg-brand-50"
        />
        <StatCard 
          title="Critical Open" 
          value={stats.criticalTickets} 
          icon={AlertTriangle}
          iconColor="text-red-600 bg-red-50"
          change={{ value: 2, type: 'increase' }}
        />
        <StatCard 
          title="Resolved Today" 
          value={resolvedToday} 
          icon={CheckCircle}
          iconColor="text-green-600 bg-green-50"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard 
          title="Avg Resolution" 
          value={`${stats.averageResolutionTime}h`} 
          icon={Clock}
          iconColor="text-blue-600 bg-blue-50"
          change={{ value: 5, type: 'increase' }}
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdueTickets} 
          icon={AlertCircle}
          iconColor="text-orange-600 bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Assigned Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900">My Active Tickets</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.MY_REQUESTS)}>
              View All
            </Button>
          </div>
          <TicketTable tickets={assignedTickets} />
        </div>

        {/* Sidebar - Unassigned Critical Tickets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              Unassigned Critical
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.PRIORITY_QUEUE)}>
              Open Queue
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
            {criticalTickets.length > 0 ? (
              <div className="divide-y divide-surface-100">
                {criticalTickets.map(ticket => (
                  <div 
                    key={ticket.id} 
                    className="p-4 hover:bg-surface-50 transition-colors cursor-pointer border-l-4 border-l-red-500"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <PriorityBadge priority={ticket.priority} />
                      <span className="text-xs text-surface-500">{formatDate(ticket.createdAt)}</span>
                    </div>
                    <h3 className="text-sm font-medium text-surface-900 line-clamp-2 mb-2">
                      {ticket.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <StatusBadge status={ticket.status} />
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2 py-0">
                        Take It
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-surface-500 flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <p>No unassigned critical tickets!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
