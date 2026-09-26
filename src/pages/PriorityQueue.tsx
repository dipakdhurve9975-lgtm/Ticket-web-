import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '@/services/ticketService';
import { useAuth } from '@/hooks/useAuth';
import { TicketPriority, TicketStatus, type Ticket } from '@/types';
import { LoadingState } from '@/components/common/LoadingState';
import { SearchBar } from '@/components/common/SearchBar';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime, isOverdue } from '@/utils/formatters';
import { Clock, AlertCircle, UserPlus, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

export function PriorityQueue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchQueue = async () => {
      setIsLoading(true);
      try {
        const result = await ticketService.getTickets();
        
        // Filter open/in-progress and sort by priority score
        const queueTickets = result.data
          .filter(t => [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.WAITING].includes(t.status))
          .sort((a, b) => b.priorityScore - a.priorityScore);
          
        setTickets(queueTickets);
      } catch (error) {
        console.error("Failed to load queue", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueue();
  }, []);

  const handleAssign = async (ticket: Ticket) => {
    if (!user) return;
    try {
      const newStatus = ticket.status === TicketStatus.OPEN ? TicketStatus.IN_PROGRESS : ticket.status;
      await ticketService.updateTicket(ticket.id, {
        assignedTo: user.id,
        assignedToName: user.name,
        status: newStatus
      });
      setTickets(tickets.map(t => 
        t.id === ticket.id 
          ? { ...t, assignedTo: user.id, assignedToName: user.name, status: newStatus }
          : t
      ));
    } catch (error) {
      console.error("Failed to assign ticket", error);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.requester.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTickets = {
    CRITICAL: filteredTickets.filter(t => t.priority === TicketPriority.CRITICAL),
    HIGH: filteredTickets.filter(t => t.priority === TicketPriority.HIGH),
    MEDIUM: filteredTickets.filter(t => t.priority === TicketPriority.MEDIUM),
    LOW: filteredTickets.filter(t => t.priority === TicketPriority.LOW),
  };

  const PrioritySection = ({ 
    title, 
    tickets: sectionTickets, 
    priority 
  }: { 
    title: string; 
    tickets: Ticket[]; 
    priority: TicketPriority;
  }) => {
    if (sectionTickets.length === 0) return null;

    const borderColor = 
      priority === TicketPriority.CRITICAL ? 'border-red-500' :
      priority === TicketPriority.HIGH ? 'border-orange-500' :
      priority === TicketPriority.MEDIUM ? 'border-yellow-500' : 'border-green-500';

    return (
      <div className="space-y-3 mb-8">
        <div className="flex items-center justify-between pb-2 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900 flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 font-normal">
              {sectionTickets.length}
            </span>
          </h2>
        </div>

        <div className="space-y-3">
          {sectionTickets.map(ticket => {
            const ticketIsOverdue = isOverdue(ticket.dueAt);
            return (
              <div 
                key={ticket.id}
                className={cn(
                  "bg-white rounded-lg border border-surface-200 p-4 shadow-sm hover:shadow-md transition-shadow",
                  "border-l-4",
                  borderColor
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-medium text-surface-500">{ticket.id}</span>
                      <PriorityBadge priority={ticket.priority} priorityScore={ticket.priorityScore} />
                      <StatusBadge status={ticket.status} />
                      <span className="text-xs text-surface-400 font-semibold">• Priority Score: {ticket.priorityScore}/100</span>
                    </div>

                    <h3 
                      className="text-base font-semibold text-surface-900 hover:text-brand-600 cursor-pointer transition-colors"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      {ticket.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-surface-500 pt-1 flex-wrap">
                      <div>
                        Requester: <span className="font-medium text-surface-700">{ticket.requester}</span>
                      </div>
                      <span className="text-surface-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-surface-700">{ticket.department}</span>
                        <span className="text-surface-300">•</span>
                        <span>{ticket.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatRelativeTime(ticket.createdAt)}
                      </div>
                      {ticketIsOverdue && (
                        <div className="flex items-center gap-1 text-red-600 font-medium">
                          <AlertCircle className="w-4 h-4" />
                          Overdue
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-surface-100 pt-4 md:pt-0 md:pl-4 min-w-[140px]">
                    <div className="text-sm">
                      {ticket.assignedToName ? (
                        <div className="flex flex-col md:items-end">
                          <span className="text-xs text-surface-400">Assigned to</span>
                          <span className="font-medium text-surface-800">{ticket.assignedToName}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          Unassigned
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!ticket.assignedTo && (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleAssign(ticket)}
                          className="flex items-center gap-1 text-xs"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Assign Me</span>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingState message="Loading priority queue..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900">Intelligent Priority Queue</h1>
          <p className="text-surface-500 mt-1">
            Service requests ranked by priority score calculated by the backend system.
          </p>
        </div>
        
        <div className="w-full sm:w-72">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search queue..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <PrioritySection title="Critical Priority" tickets={groupedTickets.CRITICAL} priority={TicketPriority.CRITICAL} />
        <PrioritySection title="High Priority" tickets={groupedTickets.HIGH} priority={TicketPriority.HIGH} />
        <PrioritySection title="Medium Priority" tickets={groupedTickets.MEDIUM} priority={TicketPriority.MEDIUM} />
        <PrioritySection title="Low Priority" tickets={groupedTickets.LOW} priority={TicketPriority.LOW} />
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-surface-200">
            <p className="text-surface-500">No tickets found in the queue matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
