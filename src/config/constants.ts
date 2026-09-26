import { TicketPriority, TicketStatus } from '@/types';

export const APP_NAME = 'ServiceDesk AI';

export const TICKET_CATEGORIES = [
  'IT',
  'HR',
  'Facilities',
  'Finance',
  'Security',
  'General',
];

export const DEPARTMENTS = [
  'Engineering',
  'Finance',
  'HR',
  'Marketing',
  'Operations',
  'Sales',
  'Support',
  'Legal',
];

export const DEFAULT_PAGE_SIZE = 10;

export const PRIORITY_ORDER: Record<TicketPriority, number> = {
  [TicketPriority.CRITICAL]: 0,
  [TicketPriority.HIGH]: 1,
  [TicketPriority.MEDIUM]: 2,
  [TicketPriority.LOW]: 3,
};

export const STATUS_ORDER: Record<TicketStatus, number> = {
  [TicketStatus.OPEN]: 0,
  [TicketStatus.IN_PROGRESS]: 1,
  [TicketStatus.WAITING]: 2,
  [TicketStatus.RESOLVED]: 3,
  [TicketStatus.CLOSED]: 4,
};
