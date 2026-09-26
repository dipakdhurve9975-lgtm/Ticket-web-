// TODO: Replace with Firebase/API data.
import { AnalyticsData, DashboardStats } from '@/types';

export const mockDashboardStats: DashboardStats = {
  totalTickets: 125,
  openTickets: 32,
  inProgressTickets: 15,
  resolvedTickets: 68,
  criticalTickets: 5,
  averageResolutionTime: 180, // minutes
  overdueTickets: 8,
  ticketsToday: 12,
};

export const mockAnalyticsData: AnalyticsData = {
  ticketsByCategory: [
    { category: 'IT', count: 50 },
    { category: 'HR', count: 20 },
    { category: 'Facilities', count: 15 },
    { category: 'Finance', count: 25 },
    { category: 'Security', count: 10 },
    { category: 'General', count: 5 },
  ],
  ticketsByPriority: [
    { priority: 'CRITICAL', count: 5 },
    { priority: 'HIGH', count: 20 },
    { priority: 'MEDIUM', count: 60 },
    { priority: 'LOW', count: 40 },
  ],
  ticketsByStatus: [
    { status: 'OPEN', count: 32 },
    { status: 'IN_PROGRESS', count: 15 },
    { status: 'WAITING', count: 10 },
    { status: 'RESOLVED', count: 45 },
    { status: 'CLOSED', count: 23 },
  ],
  ticketsOverTime: [
    { date: '2023-10-01', created: 5, resolved: 3 },
    { date: '2023-10-02', created: 8, resolved: 6 },
    { date: '2023-10-03', created: 12, resolved: 9 },
    { date: '2023-10-04', created: 7, resolved: 10 },
    { date: '2023-10-05', created: 15, resolved: 8 },
    { date: '2023-10-06', created: 10, resolved: 12 },
    { date: '2023-10-07', created: 4, resolved: 5 },
    { date: '2023-10-08', created: 6, resolved: 4 },
    { date: '2023-10-09', created: 9, resolved: 11 },
    { date: '2023-10-10', created: 14, resolved: 13 },
    { date: '2023-10-11', created: 11, resolved: 9 },
    { date: '2023-10-12', created: 8, resolved: 14 },
    { date: '2023-10-13', created: 13, resolved: 10 },
    { date: '2023-10-14', created: 5, resolved: 7 },
  ],
  resolutionTimeByCategory: [
    { category: 'IT', avgTime: 120 },
    { category: 'HR', avgTime: 240 },
    { category: 'Facilities', avgTime: 480 },
    { category: 'Finance', avgTime: 180 },
    { category: 'Security', avgTime: 60 },
    { category: 'General', avgTime: 360 },
  ],
  agentPerformance: [
    { agentName: 'Jane Smith', resolved: 45, avgTime: 150, satisfaction: 4.8 },
    { agentName: 'Mike Agent', resolved: 38, avgTime: 175, satisfaction: 4.6 },
    { agentName: 'David Admin', resolved: 12, avgTime: 210, satisfaction: 4.9 },
  ],
  departmentBreakdown: [
    { department: 'Engineering', open: 12, resolved: 28, total: 40 },
    { department: 'Sales', open: 8, resolved: 15, total: 23 },
    { department: 'Marketing', open: 5, resolved: 12, total: 17 },
    { department: 'HR', open: 3, resolved: 8, total: 11 },
    { department: 'Operations', open: 4, resolved: 15, total: 19 },
    { department: 'Finance', open: 5, resolved: 10, total: 15 },
  ],
};
