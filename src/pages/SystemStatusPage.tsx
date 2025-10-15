import { SystemStatus } from "@/components/SystemStatus";

export const SystemStatusPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <p className="text-gray-600 mt-2">
          Real-time system status and health monitoring
        </p>
      </div>

      {/* Use WebSocket for real-time updates */}
      <SystemStatus useWebSocket={true} />

      {/* Alternative: Use polling every 30 seconds */}
      {/* <SystemStatus useWebSocket={false} pollingInterval={30000} /> */}
    </div>
  );
};
