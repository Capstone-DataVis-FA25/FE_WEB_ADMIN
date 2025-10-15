import apiClient from '@/lib/apiClient';
import type { SystemStatus } from '@/types/system.types';

export const systemService = {
    /**
     * Get current system status
     */
    getSystemStatus: async (): Promise<SystemStatus> => {
        const response = await apiClient.get<SystemStatus>('/system/status');
        return response;
    },
};
