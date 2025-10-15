import { useSystemStatus } from "@/hooks/useSystemStatus";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";

interface SystemStatusProps {
  useWebSocket?: boolean;
  pollingInterval?: number;
}

export const SystemStatus = ({
  useWebSocket = true,
  pollingInterval = 0,
}: SystemStatusProps) => {
  const { systemStatus, loading, error, connected, refetch } = useSystemStatus({
    autoConnect: useWebSocket,
    pollingInterval: useWebSocket ? 0 : pollingInterval,
  });

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.join(" ") || "0m";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && !systemStatus) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Spinner />
          <span className="ml-2">Loading system status...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <Alert variant="destructive">
          <p className="font-semibold">Error loading system status</p>
          <p className="text-sm mt-1">{error}</p>
          <Button onClick={refetch} className="mt-3" size="sm">
            Retry
          </Button>
        </Alert>
      </Card>
    );
  }

  if (!systemStatus) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">System Status</h2>
        <div className="flex items-center gap-2">
          {useWebSocket && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          )}
          <Button onClick={refetch} size="sm" variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              systemStatus.status === "healthy"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {systemStatus.status.toUpperCase()}
          </div>
          <span className="text-sm text-gray-500">
            Last updated: {formatDate(systemStatus.timestamp)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Uptime */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Uptime</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Process:</span>
              <span className="font-medium">
                {formatUptime(systemStatus.uptime.process)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">System:</span>
              <span className="font-medium">
                {formatUptime(systemStatus.uptime.system)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Started:</span>
              <span className="font-medium">
                {formatDate(systemStatus.uptime.startTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Memory */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Memory</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">RSS:</span>
              <span className="font-medium">
                {formatBytes(systemStatus.memory.rss)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Heap Total:</span>
              <span className="font-medium">
                {formatBytes(systemStatus.memory.heapTotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Heap Used:</span>
              <span className="font-medium">
                {formatBytes(systemStatus.memory.heapUsed)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">External:</span>
              <span className="font-medium">
                {formatBytes(systemStatus.memory.external)}
              </span>
            </div>
          </div>
        </div>

        {/* CPU */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">CPU</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cores:</span>
              <span className="font-medium">{systemStatus.cpu.cores}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Load Average:</span>
              <span className="font-medium">
                {systemStatus.cpu.loadAverage
                  .map((l) => l.toFixed(2))
                  .join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">System Info</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium">
                {systemStatus.system.platform}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Architecture:</span>
              <span className="font-medium">{systemStatus.system.arch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hostname:</span>
              <span className="font-medium">
                {systemStatus.system.hostname}
              </span>
            </div>
          </div>
        </div>

        {/* Application Info */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Application</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">{systemStatus.app.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Node Version:</span>
              <span className="font-medium">
                {systemStatus.app.nodeVersion}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Environment:</span>
              <span className="font-medium">
                {systemStatus.app.environment}
              </span>
            </div>
          </div>
        </div>

        {/* Health Checks */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Health Checks</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database:</span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    systemStatus.healthChecks.database.status === "healthy"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="font-medium text-sm">
                  {systemStatus.healthChecks.database.status}
                </span>
              </div>
            </div>
            {systemStatus.healthChecks.database.message && (
              <p className="text-xs text-gray-500">
                {systemStatus.healthChecks.database.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
