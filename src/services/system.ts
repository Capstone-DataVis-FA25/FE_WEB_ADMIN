import apiClient from '@/lib/apiClient';
import type { Activity, SystemStatus, AdminTransactionPage } from '@/types/system.types';
import { API_ENDPOINTS } from '@/constants/api.constants';

export const systemService = {
    /**
     * Get current system status
     */
    getSystemStatus: async (): Promise<SystemStatus> => {
        const response = await apiClient.get<SystemStatus>('/system/status');
        return response;
    },
    /**
     * Get activity log
     */
    getActivityLog: async (): Promise<Activity[]> => {
        const response = await apiClient.get<{ data: Activity[] }>('admin/activity?page=1&limit=30');
        return response.data;
    },
    /**
     * Get total revenue (all time)
     */
    getTotalRevenue: async (): Promise<number> => {
        const response = await apiClient.get<{ totalRevenue: number }>(
            '/payments/revenue/total'
        );
        return response.totalRevenue;
    },
    /**
     * Get revenue for last 30 days (returns array for chart)
     */
    getRevenueLast30Days: async (): Promise<{ date: string; revenue: number }[]> => {
        const response = await apiClient.get<{ revenueLast30Days: { date: string; revenue: number }[] }>(
            '/payments/revenue/last-30-days'
        );
        // apiClient returns response.data.data which is { revenueLast30Days: [...] }
        return response.revenueLast30Days;
    },
    /**
     * Get admin payment transactions (paginated)
     */
    getAdminTransactions: async (page = 1, limit = 20): Promise<AdminTransactionPage> => {
        // apiClient returns response.data.data directly
        return apiClient.get<AdminTransactionPage>(
            `${API_ENDPOINTS.ADMIN_TRANSACTIONS}?page=${page}&limit=${limit}`
        );
    },
};