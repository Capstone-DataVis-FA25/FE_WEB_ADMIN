import apiClient from '@/lib/apiClient';

export interface UserResourceUsage {
  usage: {
    datasetsCount: number;
    chartsCount: number;
    aiRequestsCount: number;
  };
  limits: {
    maxDatasets: number | null;
    maxCharts: number | null;
    maxAIRequests: number | null;
  };
  percentage: {
    datasets: number;
    charts: number;
    aiRequests: number;
  };
  warnings: string[];
  subscriptionPlan: {
    id: string;
    name: string;
  } | null;
}

export interface UserResourceUsageWithId extends UserResourceUsage {
  userId: string;
  userName?: string;
}

export interface TopUser {
  userId: string;
  userName: string;
  email: string;
  datasetsCount: number;
  chartsCount: number;
  totalResources: number;
}

export interface TimeSeriesDataPoint {
  period: string;
  date: string;
  datasetsCount: number;
  chartsCount: number;
  totalResources: number;
}

export interface ResourceUsageOverTimeResponse {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  topUsers: TopUser[];
  timeSeriesData: TimeSeriesDataPoint[];
  summary: {
    totalDatasets: number;
    totalCharts: number;
    totalUsers: number;
  };
}

const resourceUsageService = {
  getUserResourceUsage: async (userId: string): Promise<UserResourceUsage> => {
    return await apiClient.get(`/users/${userId}/resource-usage`);
  },

  // Get resource usage for multiple users
  getUsersResourceUsage: async (userIds: string[]): Promise<UserResourceUsageWithId[]> => {
    const promises = userIds.map(async (userId) => {
      try {
        const usage = await apiClient.get<UserResourceUsage>(`/users/${userId}/resource-usage`);
        return { ...usage, userId };
      } catch (error) {
        console.error(`Failed to fetch resource usage for user ${userId}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result): result is UserResourceUsageWithId => result !== null);
  },

  // Get resource usage statistics over time
  getResourceUsageOverTime: async (
    period: 'day' | 'week' | 'month' | 'year' = 'week'
  ): Promise<ResourceUsageOverTimeResponse> => {
    return apiClient.get<ResourceUsageOverTimeResponse>(
      `/users/stats/resource-usage-over-time?period=${period}`
    );
  },
};

export default resourceUsageService;
