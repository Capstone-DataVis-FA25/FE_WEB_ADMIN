import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { SystemStatus } from '@/types/system.types';
import { systemService } from '@/services/system';

interface UseSystemStatusOptions {
    autoConnect?: boolean;
    pollingInterval?: number; // milliseconds, 0 means use WebSocket only
}

interface UseSystemStatusReturn {
    systemStatus: SystemStatus | null;
    loading: boolean;
    error: string | null;
    connected: boolean;
    refetch: () => Promise<void>;
}

/**
 * Hook to get system status via WebSocket or polling
 * @param options Configuration options
 * @returns System status data and connection state
 */
export const useSystemStatus = (
    options: UseSystemStatusOptions = {}
): UseSystemStatusReturn => {
    const { autoConnect = true, pollingInterval = 0 } = options;

    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Fetch system status via API
    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await systemService.getSystemStatus();
            setSystemStatus(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch system status');
            console.error('Error fetching system status:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Setup WebSocket connection
    useEffect(() => {
        if (!autoConnect || pollingInterval > 0) return;

        const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        socketInstance.on('connect', () => {
            console.log('Connected to system status WebSocket');
            setConnected(true);
            setError(null);
            // Request initial status
            socketInstance.emit('getStatus');
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from system status WebSocket');
            setConnected(false);
        });

        socketInstance.on('systemStatus', (data: SystemStatus) => {
            console.log('Received system status:', data);
            setSystemStatus(data);
            setLoading(false);
            setError(null);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('WebSocket connection error:', err);
            setError('WebSocket connection failed');
            setConnected(false);
            setLoading(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [autoConnect, pollingInterval]);

    // Setup polling if specified
    useEffect(() => {
        if (pollingInterval <= 0) return;

        // Initial fetch
        refetch();

        // Setup interval
        const intervalId = setInterval(() => {
            refetch();
        }, pollingInterval);

        return () => {
            clearInterval(intervalId);
        };
    }, [pollingInterval, refetch]);

    // Request status update via WebSocket
    const requestStatus = useCallback(() => {
        if (socket && connected) {
            socket.emit('getStatus');
        }
    }, [socket, connected]);

    return {
        systemStatus,
        loading,
        error,
        connected,
        refetch: pollingInterval > 0 ? refetch : requestStatus,
    };
};
