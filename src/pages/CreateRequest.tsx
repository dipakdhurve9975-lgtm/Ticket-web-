import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Info, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ticketService } from '@/services/ticketService';
import { ROUTES, getTicketDetailsPath } from '@/config/routes';
import { TICKET_CATEGORIES, DEPARTMENTS } from '@/config/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import type { Ticket } from '@/types';

export const CreateRequest: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(TICKET_CATEGORIES[0]);
  const [department, setDepartment] = useState(user?.department || DEPARTMENTS[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    
    try {
      const ticket = await ticketService.createTicket({
        title,
        category,
        department,
        description,
        requester: user?.name || 'Authorized User',
        requesterId: user?.id || 'usr-1',
      });
      setCreatedTicket(ticket);
    } catch (error) {
      console.error('Failed to create ticket', error);
      alert('Failed to submit ticket. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdTicket) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card className="border-2 border-brand-500/20 shadow-xl overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Service Request Submitted!</h2>
            <p className="text-brand-100 mt-1 text-sm">
              Your request has been successfully recorded in the centralized Firebase system.
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            <div className="bg-surface-50 rounded-2xl p-5 border border-surface-200 space-y-4">
              <div className="flex items-center justify-between border-b border-surface-200/60 pb-3">
                <span className="text-xs uppercase font-semibold text-surface-500 tracking-wider">Ticket Reference ID</span>
                <span className="text-lg font-mono font-bold text-brand-600">{createdTicket.id}</span>
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-surface-500 tracking-wider block mb-1">Issue Title</span>
                <p className="text-base font-medium text-surface-900">{createdTicket.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs text-surface-500 block mb-1">Category & Dept</span>
                  <p className="text-sm font-medium text-surface-800">{createdTicket.category} • {createdTicket.department}</p>
                </div>
                <div>
                  <span className="text-xs text-surface-500 block mb-1">Intelligent Priority</span>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={createdTicket.priority} priorityScore={createdTicket.priorityScore} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50/60 rounded-xl border border-orange-200/60 text-xs text-brand-900">
              <ShieldAlert className="w-5 h-5 text-brand-500 shrink-0" />
              <span>
                Our prioritization engine evaluated this request with priority score <strong>{createdTicket.priorityScore}/100</strong>. It is now queued for immediate agent action.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button 
                variant="primary" 
                className="w-full sm:flex-1 py-3 text-base flex items-center justify-center gap-2"
                onClick={() => navigate(getTicketDetailsPath(createdTicket.id))}
              >
                <span>View Ticket Details</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:flex-1 py-3 text-base"
                onClick={() => {
                  setCreatedTicket(null);
                  setTitle('');
                  setDescription('');
                }}
              >
                Create Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Create Service Request</h1>
        <p className="text-surface-500 mt-1">Submit your incident or service requirement to the support team.</p>
      </div>

      <Card className="shadow-soft border border-surface-200/80 rounded-2xl bg-white">
        <CardHeader className="pb-4 border-b border-surface-100">
          <CardTitle className="text-lg text-surface-900">Request Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-surface-800">
                Title <span className="text-brand-500">*</span>
              </label>
              <Input
                id="title"
                placeholder="e.g., Server connectivity failure, CRM access denied"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-semibold text-surface-800">
                  Category
                </label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={TICKET_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-semibold text-surface-800">
                  Department
                </label>
                <Select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  options={DEPARTMENTS.map(dept => ({ value: dept, label: dept }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-surface-800">
                Description <span className="text-brand-500">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Please describe the issue in detail, including affected systems and business impact..."
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-800">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-surface-200 hover:border-brand-400 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-surface-50/50">
                <UploadCloud className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-surface-700">Click to upload or drag files here</p>
                <p className="text-xs text-surface-400 mt-1">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>

            <div className="p-4 bg-cream-100 rounded-xl border border-cream-300 flex items-start gap-3">
              <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="text-xs text-surface-700 leading-relaxed">
                <strong>Intelligent Prioritization Notice:</strong> Priority is automatically assessed based on the system severity, department impact, and issue description.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.MY_REQUESTS)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !title.trim() || !description.trim()}
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 shadow-orange-glow"
              >
                {isSubmitting ? 'Submitting to Firebase...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
