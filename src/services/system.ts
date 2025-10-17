import apiClient from '@/lib/apiClient';
import type { Activity, SystemStatus } from '@/types/system.types';

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
        const response = await apiClient.get<Activity[]>('admin/activity?page=1&limit=30');
        console.log("activity log: ", response);
        return response.data;
    },
};