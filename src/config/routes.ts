export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  CREATE_REQUEST: '/requests/new',
  MY_REQUESTS: '/requests',
  TICKET_DETAILS: '/tickets/:id',
  AGENT_DASHBOARD: '/agent',
  PRIORITY_QUEUE: '/agent/queue',
  ADMIN_DASHBOARD: '/admin',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

export function getTicketDetailsPath(id: string): string {
  return ROUTES.TICKET_DETAILS.replace(':id', id);
}
