import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Calendar, User as UserIcon, Tag, Building2, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ticketService } from '@/services/ticketService';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { formatDate, formatRelativeTime } from '@/utils/formatters';
import type { Ticket, Comment } from '@/types';

export const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const isAgentOrAdmin = user?.role === 'AGENT' || user?.role === 'ADMIN';

  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const ticketData = await ticketService.getTicketById(id);
        if (ticketData) {
          setTicket(ticketData);
          setComments(ticketData.comments || []);
        } else {
          setError('Ticket not found');
        }
      } catch (err) {
        console.error('Failed to fetch ticket', err);
        setError('Failed to load ticket details');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id || !user) return;

    try {
      setSubmittingComment(true);
      const updatedTicket = await ticketService.addComment(id, newComment, user);
      setTicket(updatedTicket);
      setComments(updatedTicket.comments);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <LoadingState message="Loading ticket details..." />;
  if (error || !ticket) return <ErrorState title="Error" message={error || 'Ticket not found'} />;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-surface-500 font-mono">{ticket.id}</span>
            <PriorityBadge priority={ticket.priority} priorityScore={ticket.priorityScore} />
            <StatusBadge status={ticket.status} />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">{ticket.title}</h1>
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <span>Opened by <strong className="text-surface-700">{ticket.requester}</strong></span>
            <span>•</span>
            <span>{formatRelativeTime(ticket.createdAt)}</span>
          </div>
        </div>

        {/* Description */}
        <Card>
          <CardHeader className="border-b border-surface-100 pb-3">
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-surface-800 whitespace-pre-wrap leading-relaxed text-sm">
              {ticket.description}
            </p>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-surface-900">Activity & Comments</h2>
          
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar name={comment.authorName} size="md" className="shrink-0" />
                <div className="flex-1 bg-white border border-surface-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-surface-900">{comment.authorName}</span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-surface-100 text-surface-600 rounded-full">
                        {comment.authorRole}
                      </span>
                    </div>
                    <span className="text-xs text-surface-500">{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-surface-700 whitespace-pre-wrap text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <div className="flex gap-4 mt-6">
            <Avatar name={user?.name || 'User'} size="md" className="shrink-0" />
            <form onSubmit={handleAddComment} className="flex-1 space-y-3">
              <Textarea
                placeholder="Type your message here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="w-full resize-y"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!newComment.trim() || submittingComment} className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar Info Panel */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        <Card>
          <CardHeader className="border-b border-surface-100 pb-4">
            <CardTitle className="text-lg">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-y-4">
              <div className="space-y-1">
                <span className="text-xs text-surface-500 font-medium flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5" /> Requester</span>
                <p className="text-sm font-medium text-surface-900">{ticket.requester || 'Unknown'}</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-surface-500 font-medium flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5" /> Assigned To</span>
                <p className="text-sm font-medium text-surface-900">{ticket.assignedToName || 'Unassigned'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-surface-500 font-medium flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Category</span>
                <p className="text-sm font-medium text-surface-900">{ticket.category}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-surface-500 font-medium flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Department</span>
                <p className="text-sm font-medium text-surface-900">{ticket.department}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-surface-500 font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Created</span>
                <p className="text-sm font-medium text-surface-900">{formatDate(ticket.createdAt)}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-surface-500 font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated</span>
                <p className="text-sm font-medium text-surface-900">{formatDate(ticket.updatedAt)}</p>
              </div>
              
              <div className="space-y-1 col-span-2 pt-2 border-t border-surface-100">
                <span className="text-xs text-surface-500 font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-red-500" /> Due Date</span>
                <p className="text-sm font-medium text-surface-900">{ticket.dueAt ? formatDate(ticket.dueAt) : 'None'}</p>
              </div>
            </div>
            
            {/* Priority Score info box */}
            <div className="bg-surface-50 p-3 rounded-md border border-surface-200 mt-4 flex items-center justify-between">
              <span className="text-sm text-surface-600 font-medium">Backend Priority Score</span>
              <span className="text-lg font-bold text-brand-600">{ticket.priorityScore || 0}/100</span>
            </div>
          </CardContent>
        </Card>

        {isAgentOrAdmin && (
          <Card>
            <CardHeader className="border-b border-surface-100 pb-4">
              <CardTitle className="text-lg">Agent Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full" variant="outline">Assign to Me</Button>
              <Button className="w-full bg-surface-900 hover:bg-surface-800 text-white">Update Status</Button>
              <Button className="w-full text-red-600 border-red-200 hover:bg-red-50" variant="outline">Escalate Ticket</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
