import { useEffect, useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Briefcase,
  Calendar,
  Download
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import type { AnalyticsData } from '@/types';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { LoadingState } from '@/components/common/LoadingState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

type TabType = 'overview' | 'category' | 'agent' | 'department';

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await analyticsService.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !analytics) {
    return <LoadingState message="Generating reports..." />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'category', label: 'By Category', icon: BarChart2 },
    { id: 'agent', label: 'By Agent', icon: Users },
    { id: 'department', label: 'By Department', icon: Briefcase },
  ] as const;

  const renderOverview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ticket Volume Trends (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart 
            data={analytics.ticketsOverTime} 
            xKey="date" 
            lines={[
              { dataKey: 'created', color: '#4f46e5', name: 'Created' },
              { dataKey: 'resolved', color: '#16a34a', name: 'Resolved' }
            ]} 
            height={320}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderCategory = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Volume by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart 
            data={analytics.ticketsByCategory} 
            xKey="category" 
            bars={[{ dataKey: 'count', color: '#6366f1', name: 'Tickets' }]} 
            height={300}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Avg Resolution Time by Category (Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart 
            data={analytics.resolutionTimeByCategory} 
            xKey="category" 
            bars={[{ dataKey: 'avgTime', color: '#f59e0b', name: 'Hours' }]} 
            height={300}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderAgent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Agent Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-surface-500 uppercase bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="px-6 py-4">Agent Name</th>
                <th className="px-6 py-4 text-right">Tickets Resolved</th>
                <th className="px-6 py-4 text-right">Avg Resolution Time</th>
                <th className="px-6 py-4 text-right">CSAT Score</th>
                <th className="px-6 py-4">Relative Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {analytics.agentPerformance.map((agent, i) => {
                const maxResolved = Math.max(...analytics.agentPerformance.map(a => a.resolved));
                const percent = maxResolved > 0 ? (agent.resolved / maxResolved) * 100 : 0;
                
                return (
                  <tr key={i} className="hover:bg-surface-50">
                    <td className="px-6 py-4 font-medium text-surface-900">{agent.agentName}</td>
                    <td className="px-6 py-4 text-right font-medium">{agent.resolved}</td>
                    <td className="px-6 py-4 text-right">{agent.avgTime}h</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                        agent.satisfaction >= 4.5 ? "bg-green-100 text-green-700" :
                        agent.satisfaction >= 4.0 ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      )}>
                        {agent.satisfaction.toFixed(1)} ★
                      </span>
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderDepartment = () => (
    <Card>
      <CardHeader>
        <CardTitle>Department Workload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BarChart 
            data={analytics.departmentBreakdown} 
            xKey="department" 
            bars={[
              { dataKey: 'open', color: '#3b82f6', name: 'Open' },
              { dataKey: 'resolved', color: '#22c55e', name: 'Resolved' }
            ]} 
            height={300}
          />
          
          <div className="overflow-y-auto max-h-80 scrollbar-thin pr-4">
            <div className="space-y-4">
              {analytics.departmentBreakdown.map((dept, i) => (
                <div key={i} className="p-4 bg-surface-50 rounded-lg border border-surface-200">
                  <h4 className="font-semibold text-surface-900 mb-3">{dept.department}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-surface-500">Open Tickets</p>
                      <p className="text-lg font-medium text-surface-900">{dept.open}</p>
                    </div>
                    <div>
                      <p className="text-surface-500">Resolved</p>
                      <p className="text-lg font-medium text-green-600">{dept.resolved}</p>
                    </div>
                    <div>
                      <p className="text-surface-500">Total Volume</p>
                      <p className="text-lg font-medium text-surface-900">{dept.total}</p>
                    </div>
                    <div>
                      <p className="text-surface-500">Clearance Rate</p>
                      <p className="text-lg font-medium text-blue-600">
                        {Math.round((dept.resolved / (dept.total || 1)) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900">Analytics & Reports</h1>
          <p className="text-surface-500 mt-1">
            Deep dive into your service desk performance and trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-surface-200 text-sm text-surface-600">
            <Calendar className="w-4 h-4" />
            <span>Select Date Range</span>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <div className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  isActive
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'category' && renderCategory()}
        {activeTab === 'agent' && renderAgent()}
        {activeTab === 'department' && renderDepartment()}
      </div>
    </div>
  );
}
