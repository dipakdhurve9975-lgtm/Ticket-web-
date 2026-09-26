// Enums
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING = 'WAITING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum UserRole {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  requester: string;
  requesterId: string;
  department: string;
  priority: TicketPriority;
  priorityScore: number;
  status: TicketStatus;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  dueAt?: string;
  resolvedAt?: string;
  resolutionTime?: number;
  comments: Comment[];
  attachments: Attachment[];
  tags?: string[];
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  averageResolutionTime: number;
  overdueTickets: number;
  ticketsToday: number;
}

export interface AnalyticsData {
  ticketsByCategory: { category: string; count: number }[];
  ticketsByPriority: { priority: string; count: number }[];
  ticketsByStatus: { status: string; count: number }[];
  ticketsOverTime: { date: string; created: number; resolved: number }[];
  resolutionTimeByCategory: { category: string; avgTime: number }[];
  agentPerformance: { agentName: string; resolved: number; avgTime: number; satisfaction: number }[];
  departmentBreakdown: { department: string; open: number; resolved: number; total: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  ticketId?: string;
}

// Filter/Sort types
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: string;
  department?: string;
  assignedTo?: string;
  dateRange?: { from: string; to: string };
  search?: string;
}

export type SortField = 'createdAt' | 'updatedAt' | 'priority' | 'priorityScore' | 'status' | 'title' | 'dueAt';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}
