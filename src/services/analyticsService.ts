// TODO: Connect to Firebase/API
import { mockAnalyticsData, mockDashboardStats } from '@/data/mockAnalytics';
import { AnalyticsData, DashboardStats } from '@/types';

const delay = <T>(data: T, ms = 300): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), ms));

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsData> {
    return delay(mockAnalyticsData);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return delay(mockDashboardStats);
  }
};
