import { useSystemStatus } from "@/hooks/useSystemStatus";

/**
 * Simple system status indicator for header/navbar
 */
export const SystemStatusIndicator = () => {
  const { systemStatus, connected } = useSystemStatus({
    autoConnect: true,
  });

  const isHealthy =
    systemStatus?.status === "healthy" &&
    systemStatus?.healthChecks?.database?.status === "healthy";

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
      <div
        className={`w-2 h-2 rounded-full ${
          isHealthy ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
        title={connected ? "Connected to server" : "Disconnected"}
      />
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
        {isHealthy ? "System Healthy" : "System Issue"}
      </span>
    </div>
  );
};
