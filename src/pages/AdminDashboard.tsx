import { useEffect, useState } from 'react';
import { 
  Ticket as TicketIcon, 
  FolderOpen, 
  AlertTriangle, 
  Clock, 
  AlertCircle, 
  Calendar,
  Users
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import type { AnalyticsData, DashboardStats } from '@/types';
import { StatCard } from '@/components/charts/StatCard';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { LoadingState } from '@/components/common/LoadingState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsData, analyticsData] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getAnalytics()
        ]);
        
        setStats(statsData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Failed to load admin dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !stats || !analytics) {
    return <LoadingState message="Loading organization overview..." />;
  }

  const priorityPieData = analytics.ticketsByPriority.map(p => ({
    name: p.priority,
    value: p.count,
    color: p.priority === 'CRITICAL' ? '#dc2626' : p.priority === 'HIGH' ? '#ea580c' : p.priority === 'MEDIUM' ? '#ca8a04' : '#16a34a'
  }));

  const statusPieData = analytics.ticketsByStatus.map(s => ({
    name: s.status,
    value: s.count,
    color: s.status === 'OPEN' ? '#3b82f6' : s.status === 'IN_PROGRESS' ? '#8b5cf6' : s.status === 'WAITING' ? '#f59e0b' : '#10b981'
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900">Organization Overview</h1>
          <p className="text-surface-500 mt-1">High-level view of ticket operations and performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-surface-200 text-sm text-surface-600">
          <Calendar className="w-4 h-4" />
          <span>Last 14 Days</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="Total Tickets" 
          value={stats.totalTickets} 
          icon={TicketIcon}
          iconColor="text-surface-600 bg-surface-100"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard 
          title="Open Tickets" 
          value={stats.openTickets} 
          icon={FolderOpen}
          iconColor="text-blue-600 bg-blue-50"
          change={{ value: 5, type: 'increase' }}
        />
        <StatCard 
          title="Critical" 
          value={stats.criticalTickets} 
          icon={AlertTriangle}
          iconColor="text-red-600 bg-red-50"
          change={{ value: 2, type: 'decrease' }}
        />
        <StatCard 
          title="Avg Resolution" 
          value={`${stats.averageResolutionTime}h`} 
          icon={Clock}
          iconColor="text-indigo-600 bg-indigo-50"
          change={{ value: 8, type: 'decrease' }}
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdueTickets} 
          icon={AlertCircle}
          iconColor="text-orange-600 bg-orange-50"
        />
        <StatCard 
          title="Tickets Today" 
          value={stats.ticketsToday} 
          icon={Calendar}
          iconColor="text-brand-600 bg-brand-50"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Volume Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={analytics.ticketsOverTime} 
              xKey="date" 
              lines={[
                { dataKey: 'created', color: '#4f46e5', name: 'Created' },
                { dataKey: 'resolved', color: '#10b981', name: 'Resolved' }
              ]} 
              height={260}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={analytics.ticketsByCategory} 
              xKey="category" 
              bars={[{ dataKey: 'count', color: '#6366f1', name: 'Tickets' }]} 
              height={260}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={priorityPieData} height={260} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={statusPieData} height={260} />
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-brand-600" />
              <span>Department Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-surface-500 uppercase bg-surface-50">
                  <tr>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3 text-right">Open</th>
                    <th className="px-4 py-3 text-right">Resolved</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {analytics.departmentBreakdown.map((dept, i) => (
                    <tr key={i} className="hover:bg-surface-50">
                      <td className="px-4 py-3 font-medium text-surface-900">{dept.department}</td>
                      <td className="px-4 py-3 text-right text-blue-600 font-medium">{dept.open}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">{dept.resolved}</td>
                      <td className="px-4 py-3 text-right font-medium">{dept.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              <span>Agent Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-surface-500 uppercase bg-surface-50">
                  <tr>
                    <th className="px-4 py-3">Agent Name</th>
                    <th className="px-4 py-3 text-right">Resolved</th>
                    <th className="px-4 py-3 text-right">Avg Time</th>
                    <th className="px-4 py-3 text-right">Satisfaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {analytics.agentPerformance.map((agent, i) => (
                    <tr key={i} className="hover:bg-surface-50">
                      <td className="px-4 py-3 font-medium text-surface-900">{agent.agentName}</td>
                      <td className="px-4 py-3 text-right font-medium">{agent.resolved}</td>
                      <td className="px-4 py-3 text-right">{agent.avgTime}h</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="font-medium">{agent.satisfaction.toFixed(1)}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
