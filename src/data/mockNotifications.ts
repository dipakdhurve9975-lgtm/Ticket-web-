// TODO: Replace with Firebase/API data.
import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Ticket Assigned',
    message: 'Ticket REQ-1001 has been assigned to you.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    ticketId: 'REQ-1001',
  },
  {
    id: 'notif-2',
    title: 'SLA Warning',
    message: 'Ticket REQ-1003 is approaching its SLA deadline.',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    ticketId: 'REQ-1003',
  },
  {
    id: 'notif-3',
    title: 'New Comment',
    message: 'Bob Builder commented on REQ-1007.',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    ticketId: 'REQ-1007',
  },
  {
    id: 'notif-4',
    title: 'Ticket Resolved',
    message: 'Your ticket REQ-1004 has been resolved.',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    ticketId: 'REQ-1004',
  },
  {
    id: 'notif-5',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur this Saturday at 2 AM EST.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'notif-6',
    title: 'Critical Outage Reported',
    message: 'A critical outage (REQ-1001) has been reported in Engineering.',
    type: 'error',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    ticketId: 'REQ-1001',
  }
];
