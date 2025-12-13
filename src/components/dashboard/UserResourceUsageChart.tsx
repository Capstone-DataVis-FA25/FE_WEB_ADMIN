import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, BarChart3, TrendingUp, Users } from "lucide-react";
import resourceUsageService, {
  type ResourceUsageOverTimeResponse,
} from "@/services/resourceUsage.service";

const periodOptions = [
  { value: "day", label: "Last 24 Hours" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "year", label: "Last 12 Months" },
] as const;

type Period = "day" | "week" | "month" | "year";

export function UserResourceUsageChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");

  const {
    data: resourceData,
    isLoading,
    error,
  } = useQuery<ResourceUsageOverTimeResponse>({
    queryKey: ["resourceUsageOverTime", selectedPeriod],
    queryFn: () =>
      resourceUsageService.getResourceUsageOverTime(selectedPeriod),
    refetchInterval: 60000, // Refetch every minute
  });

  const chartData = useMemo(() => {
    if (!resourceData?.timeSeriesData) return [];
    return resourceData.timeSeriesData;
  }, [resourceData]);

  if (error) {
    return (
      <Card className="col-span-2 rounded-xl border border-red-200/50 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold">
              User Resource Usage Over Time
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex items-center justify-center h-[400px]">
          <p className="text-destructive">Failed to load resource usage data</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="col-span-2 rounded-xl border border-border shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg font-bold">
                User Resource Usage Over Time
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Loading data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!resourceData || chartData.length === 0) {
    return (
      <Card className="col-span-2 rounded-xl border border-border shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold">
              User Resource Usage Over Time
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 rounded-xl border border-border shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                User Resource Usage Over Time
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {resourceData.summary.totalDatasets} datasets,{" "}
                {resourceData.summary.totalCharts} charts from{" "}
                {resourceData.summary.totalUsers} users
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedPeriod === option.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Time Series Chart */}
        <div className="h-[300px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#333"
                opacity={0.1}
              />
              <XAxis
                dataKey="period"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: "bold",
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    datasetsCount: "Datasets",
                    chartsCount: "Charts",
                    totalResources: "Total Resources",
                  };
                  return [value.toLocaleString(), labels[name] || name];
                }}
              />
              <Legend
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    datasetsCount: "Datasets",
                    chartsCount: "Charts",
                    totalResources: "Total Resources",
                  };
                  return labels[value] || value;
                }}
              />
              <Bar
                dataKey="datasetsCount"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                name="datasetsCount"
              />
              <Bar
                dataKey="chartsCount"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                name="chartsCount"
              />
              <Line
                type="monotone"
                dataKey="totalResources"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", r: 4 }}
                name="totalResources"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Top Users Section */}
        {resourceData.topUsers && resourceData.topUsers.length > 0 && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">
                Top Users by Resource Usage
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {resourceData.topUsers.slice(0, 6).map((user, index) => (
                <div
                  key={user.userId}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.userName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="flex items-center gap-1">
                      <Database className="w-3 h-3 text-blue-500" />
                      <span className="text-xs font-medium">
                        {user.datasetsCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-medium">
                        {user.chartsCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
