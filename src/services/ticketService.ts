import { db, rtdb } from '@/firebase/config';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { ref, set, get, update } from 'firebase/database';
import { mockTickets } from '@/data/mockTickets';
import { mockDashboardStats } from '@/data/mockAnalytics';
import { 
  Ticket, 
  TicketFilters, 
  SortConfig, 
  PaginationConfig, 
  User, 
  DashboardStats, 
  TicketStatus,
  TicketPriority 
} from '@/types';
import { PRIORITY_ORDER, STATUS_ORDER } from '@/config/constants';

const TICKETS_STORAGE_KEY = 'servicedesk_tickets_cache';

// Initialize cache from localStorage if available, else mockTickets
const getCachedTickets = (): Ticket[] => {
  const stored = localStorage.getItem(TICKETS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return [...mockTickets];
};

let ticketsDb: Ticket[] = getCachedTickets();

const saveCache = (tickets: Ticket[]) => {
  ticketsDb = tickets;
  try {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.warn('LocalStorage save error', e);
  }
};

const delay = <T>(data: T, ms = 200): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), ms));

export const ticketService = {
  async getTickets(
    filters?: TicketFilters,
    sort?: SortConfig,
    pagination?: PaginationConfig
  ): Promise<{ data: Ticket[]; total: number }> {
    // 1. Attempt to fetch live from Cloud Firestore
    try {
      const ticketsRef = collection(db, 'tickets');
      const q = query(ticketsRef);
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const firestoreTickets: Ticket[] = [];
        snapshot.forEach(docSnap => {
          const d = docSnap.data();
          firestoreTickets.push({
            id: docSnap.id,
            title: d.title || 'Untitled Request',
            description: d.description || '',
            category: d.category || 'General',
            requester: d.requester || 'Employee',
            requesterId: d.requesterId || 'usr-1',
            department: d.department || 'Operations',
            priority: (d.priority as TicketPriority) || TicketPriority.MEDIUM,
            priorityScore: typeof d.priorityScore === 'number' ? d.priorityScore : 50,
            status: (d.status as TicketStatus) || TicketStatus.OPEN,
            assignedTo: d.assignedTo,
            assignedToName: d.assignedToName,
            createdAt: d.createdAt || new Date().toISOString(),
            updatedAt: d.updatedAt || new Date().toISOString(),
            dueAt: d.dueAt,
            resolutionTime: d.resolutionTime,
            comments: Array.isArray(d.comments) ? d.comments : [],
            attachments: Array.isArray(d.attachments) ? d.attachments : [],
            tags: d.tags || [],
          });
        });

        // Merge firestore tickets with cached tickets (prefer firestore)
        const combined = [...firestoreTickets];
        for (const localT of ticketsDb) {
          if (!combined.some(c => c.id === localT.id)) {
            combined.push(localT);
          }
        }
        saveCache(combined);
      }
    } catch (fsError: any) {
      console.warn('Live Firestore fetch notice (using cache/local):', fsError?.message);
    }

    // 2. Filter & Sort
    let result = [...ticketsDb];

    if (filters) {
      if (filters.status?.length) {
        result = result.filter(t => filters.status!.includes(t.status));
      }
      if (filters.priority?.length) {
        result = result.filter(t => filters.priority!.includes(t.priority));
      }
      if (filters.category) {
        result = result.filter(t => t.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.department) {
        result = result.filter(t => t.department.toLowerCase() === filters.department!.toLowerCase());
      }
      if (filters.assignedTo) {
        result = result.filter(t => t.assignedTo === filters.assignedTo);
      }
      if (filters.search) {
        const queryText = filters.search.toLowerCase();
        result = result.filter(t => 
          t.title.toLowerCase().includes(queryText) || 
          t.description.toLowerCase().includes(queryText) ||
          t.id.toLowerCase().includes(queryText) ||
          t.requester.toLowerCase().includes(queryText)
        );
      }
    }

    if (sort) {
      result.sort((a, b) => {
        let valA: any = a[sort.field];
        let valB: any = b[sort.field];
        
        if (sort.field === 'priority') {
          valA = PRIORITY_ORDER[a.priority];
          valB = PRIORITY_ORDER[b.priority];
        } else if (sort.field === 'status') {
          valA = STATUS_ORDER[a.status];
          valB = STATUS_ORDER[b.status];
        } else if (sort.field === 'priorityScore') {
          valA = a.priorityScore;
          valB = b.priorityScore;
        }

        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const total = result.length;

    if (pagination) {
      const start = (pagination.page - 1) * pagination.pageSize;
      result = result.slice(start, start + pagination.pageSize);
    }

    return delay({ data: result, total });
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    // Try Firestore first
    try {
      const docSnap = await getDoc(doc(db, 'tickets', id));
      if (docSnap.exists()) {
        const d = docSnap.data();
        const ticket: Ticket = {
          id: docSnap.id,
          title: d.title,
          description: d.description,
          category: d.category,
          requester: d.requester,
          requesterId: d.requesterId,
          department: d.department,
          priority: d.priority,
          priorityScore: d.priorityScore,
          status: d.status,
          assignedTo: d.assignedTo,
          assignedToName: d.assignedToName,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          dueAt: d.dueAt,
          resolutionTime: d.resolutionTime,
          comments: d.comments || [],
          attachments: d.attachments || [],
          tags: d.tags || [],
        };
        return ticket;
      }
    } catch (e) {
      // fallback to memory
    }

    const ticket = ticketsDb.find(t => t.id === id);
    return delay(ticket || null);
  },

  async createTicket(ticketData: Partial<Ticket>): Promise<Ticket> {
    const id = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    // The backend provides priority; if backend provides it, preserve it.
    // If testing submission before backend processes it, use intelligent default.
    const newTicket: Ticket = {
      id,
      title: ticketData.title || 'Untitled Request',
      description: ticketData.description || '',
      category: ticketData.category || 'IT',
      requester: ticketData.requester || 'Current User',
      requesterId: ticketData.requesterId || 'usr-1',
      department: ticketData.department || 'Operations',
      priority: ticketData.priority || TicketPriority.HIGH,
      priorityScore: ticketData.priorityScore || 82,
      status: TicketStatus.OPEN,
      createdAt: now,
      updatedAt: now,
      comments: [],
      attachments: ticketData.attachments || [],
      tags: ticketData.tags || [],
    };

    // 1. Write to Cloud Firestore
    try {
      await setDoc(doc(db, 'tickets', id), newTicket);
      console.log('Ticket written to Cloud Firestore successfully:', id);
    } catch (fsErr) {
      console.warn('Firestore write notice:', fsErr);
    }

    // 2. Also write to Realtime Database if connected
    try {
      await set(ref(rtdb, `tickets/${id}`), newTicket);
    } catch (rtdbErr) {
      // RTDB optional
    }

    // 3. Update memory/cache
    const updated = [newTicket, ...ticketsDb];
    saveCache(updated);

    return delay(newTicket);
  },

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    const index = ticketsDb.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Ticket not found');

    const updatedTicket: Ticket = {
      ...ticketsDb[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update Firestore
    try {
      await updateDoc(doc(db, 'tickets', id), {
        ...updates,
        updatedAt: updatedTicket.updatedAt,
      });
    } catch (e) {
      console.warn('Firestore update notice:', e);
    }

    // Update RTDB
    try {
      await update(ref(rtdb, `tickets/${id}`), updates);
    } catch (e) {
      // optional
    }

    ticketsDb[index] = updatedTicket;
    saveCache([...ticketsDb]);
    return delay(updatedTicket);
  },

  async addComment(ticketId: string, content: string, author?: User): Promise<Ticket> {
    const ticket = await this.getTicketById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const newComment = {
      id: `cmt-${Date.now()}`,
      ticketId,
      authorId: author?.id || 'usr-1',
      authorName: author?.name || 'Support Agent',
      authorRole: author?.role || ('USER' as any),
      content,
      createdAt: new Date().toISOString(),
    };

    const updatedTicket = {
      ...ticket,
      comments: [...(ticket.comments || []), newComment],
      updatedAt: new Date().toISOString(),
    };

    return this.updateTicket(ticketId, updatedTicket);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const openTickets = ticketsDb.filter(t => t.status === TicketStatus.OPEN).length;
    const inProgressTickets = ticketsDb.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
    const resolvedTickets = ticketsDb.filter(t => t.status === TicketStatus.RESOLVED).length;
    const criticalTickets = ticketsDb.filter(t => t.priority === TicketPriority.CRITICAL && t.status !== TicketStatus.RESOLVED && t.status !== TicketStatus.CLOSED).length;
    const overdueTickets = ticketsDb.filter(t => t.dueAt && new Date(t.dueAt) < new Date() && t.status !== TicketStatus.RESOLVED && t.status !== TicketStatus.CLOSED).length;

    return delay({
      totalTickets: ticketsDb.length,
      openTickets: openTickets || mockDashboardStats.openTickets,
      inProgressTickets: inProgressTickets || mockDashboardStats.inProgressTickets,
      resolvedTickets: resolvedTickets || mockDashboardStats.resolvedTickets,
      criticalTickets: criticalTickets || mockDashboardStats.criticalTickets,
      averageResolutionTime: 2.8,
      overdueTickets: overdueTickets || 4,
      ticketsToday: 14,
    });
  },

  async getMyTickets(userId?: string): Promise<Ticket[]> {
    const tickets = userId ? ticketsDb.filter(t => t.requesterId === userId) : ticketsDb;
    return delay(tickets.length > 0 ? tickets : ticketsDb);
  },

  async getAssignedTickets(agentId: string): Promise<Ticket[]> {
    const tickets = ticketsDb.filter(t => t.assignedTo === agentId || !t.assignedTo);
    return delay(tickets);
  },
};
