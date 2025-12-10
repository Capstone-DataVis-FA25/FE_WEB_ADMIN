import { axiosPrivate } from './axios';

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

const resourceUsageService = {
  // Admin: Get user's resource usage by userId
  getUserResourceUsage: async (userId: string): Promise<UserResourceUsage> => {
    const response = await axiosPrivate.get(`/users/${userId}/resource-usage`);
    return response.data;
  },

  // Get resource usage for multiple users
  getUsersResourceUsage: async (userIds: string[]): Promise<UserResourceUsageWithId[]> => {
    const promises = userIds.map(async (userId) => {
      try {
        const response = await axiosPrivate.get(`/users/${userId}/resource-usage`);
        const usage = response.data;
        return { ...usage, userId };
      } catch (error) {
        console.error(`Failed to fetch resource usage for user ${userId}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result): result is UserResourceUsageWithId => result !== null);
  },
};

export default resourceUsageService;
