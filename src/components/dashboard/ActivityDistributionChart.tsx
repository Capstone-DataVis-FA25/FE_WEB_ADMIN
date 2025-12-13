import { useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon } from "lucide-react";
import type { Activity } from "@/types/system.types";
import { COLORS } from "@/constants";

interface ActivityDistributionChartProps {
  activities: Activity[];
}

export function ActivityDistributionChart({
  activities,
}: ActivityDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!activities) return [];

    const counts: Record<string, number> = {
      Charts: 0,
      Datasets: 0,
      Users: 0,
      Other: 0,
    };

    activities.forEach((act) => {
      const action = act.action?.toLowerCase() || "";
      if (action.includes("chart")) {
        counts.Charts++;
      } else if (action.includes("dataset")) {
        counts.Datasets++;
      } else if (action.includes("user") || action.includes("login")) {
        counts.Users++;
      } else {
        counts.Other++;
      }
    });

    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [activities]);

  return (
    <Card className="rounded-xl border border-border shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
            <ActivityIcon className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-lg font-bold">
            Activity Distribution
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
