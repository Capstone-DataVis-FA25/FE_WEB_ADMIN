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

// Enhanced Activity interface with enriched metadata
export interface Activity {
    id: string;
    actorId?: string;
    actorType?: string;
    createdAt: string;
    action: string;
    resource: string;
    metadata: Record<string, unknown> & {
        description?: string;
        actor?: {
            id: string;
            name: string;
            email: string;
        };
        targetUser?: {
            id: string;
            name: string;
            email: string;
            isActive: boolean;
        };
    };
}

export interface Transaction {
  id: string;
  userId: string;
  subscriptionPlanId: string | null;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  providerTransactionId: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTransactionPage {
  data: Transaction[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}