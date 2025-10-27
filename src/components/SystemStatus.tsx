import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Server,
  Database,
  Wifi,
  HardDrive,
  RefreshCw,
} from "lucide-react";

// Types for system status
interface SystemMetric {
  name: string;
  status: "operational" | "degraded" | "down";
  value?: string;
  description: string;
}

interface SystemStatusData {
  overallStatus: "operational" | "degraded" | "down";
  lastUpdated: string;
  metrics: SystemMetric[];
}

// Mock data for demonstration
const mockSystemStatus: SystemStatusData = {
  overallStatus: "operational",
  lastUpdated: new Date().toISOString(),
  metrics: [
    {
      name: "API Server",
      status: "operational",
      value: "24ms",
      description: "Main application server",
    },
    {
      name: "Database",
      status: "operational",
      value: "12ms",
      description: "Primary database connection",
    },
    {
      name: "Cache",
      status: "operational",
      value: "5ms",
      description: "Redis cache service",
    },
    {
      name: "File Storage",
      status: "operational",
      value: "OK",
      description: "Cloud storage service",
    },
    {
      name: "Email Service",
      status: "degraded",
      value: "Delayed",
      description: "SMTP email delivery",
    },
    {
      name: "WebSocket",
      status: "operational",
      value: "Connected",
      description: "Real-time communication",
    },
  ],
};

// Function to fetch system status (replace with actual API call)
const fetchSystemStatus = async (): Promise<SystemStatusData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockSystemStatus;
};

// Status badge component
const StatusBadge = ({ status }: { status: SystemMetric["status"] }) => {
  const statusConfig = {
    operational: {
      icon: CheckCircle,
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      label: "Operational",
    },
    degraded: {
      icon: AlertTriangle,
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      label: "Degraded",
    },
    down: {
      icon: XCircle,
      className: "bg-destructive/10 text-destructive",
      label: "Down",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

// Metric card component
const MetricCard = ({ metric }: { metric: SystemMetric }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Server className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-sm">{metric.name}</h3>
          <p className="text-xs text-muted-foreground">{metric.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {metric.value && (
          <span className="text-sm font-mono text-muted-foreground">
            {metric.value}
          </span>
        )}
        <StatusBadge status={metric.status} />
      </div>
    </div>
  );
};

export const SystemStatus = ({
  useWebSocket = false,
  pollingInterval = 30000,
}: {
  useWebSocket?: boolean;
  pollingInterval?: number;
}) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<SystemStatusData>({
    queryKey: ["systemStatus"],
    queryFn: fetchSystemStatus,
    refetchInterval: pollingInterval,
    staleTime: pollingInterval - 5000, // Consider data stale 5 seconds before refetch
  });

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  // WebSocket simulation (in a real app, this would connect to a WebSocket server)
  useEffect(() => {
    if (!useWebSocket) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["systemStatus"] });
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [useWebSocket, pollingInterval, queryClient]);

  if (isLoading) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              System Status
            </CardTitle>
            <Spinner size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" className="mb-3" />
              <p className="text-muted-foreground">Loading system status...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              System Status
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Retry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-full bg-destructive/10 mb-3">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              Unable to load status
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an error fetching system status
            </p>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Refreshing...
                </>
              ) : (
                "Try Again"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallStatus = data?.overallStatus || "down";
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated)
    : new Date();

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              System Status
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={overallStatus} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <h4 className="font-medium text-sm mb-2">System Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <span>PostgreSQL 14.2</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-muted-foreground" />
              <span>1.2 Gbps</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              <span>2.4 TB Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-muted-foreground" />
              <span>8 Cores</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
