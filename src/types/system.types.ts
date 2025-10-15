export interface HealthCheck {
    status: 'healthy' | 'unhealthy';
    message?: string;
    timestamp: string;
}

export interface SystemStatus {
    status: string;
    timestamp: string;
    uptime: {
        process: number;
        system: number;
        startTime: string;
    };
    memory: {
        rss: number;
        heapTotal: number;
        heapUsed: number;
        external: number;
    };
    cpu: {
        loadAverage: number[];
        cores: number;
    };
    system: {
        platform: string;
        arch: string;
        hostname: string;
    };
    app: {
        version: string;
        nodeVersion: string;
        environment: string;
    };
    healthChecks: {
        database: HealthCheck;
    };
}
