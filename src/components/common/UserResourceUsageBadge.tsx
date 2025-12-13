import React from "react";
import { Database, BarChart3, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

interface UserResourceUsageBadgeProps {
  usage: {
    datasetsCount: number;
    chartsCount: number;
    aiRequestsCount: number;
  };
  limits: {
    maxDatasets: number | null;
    maxCharts: number | null;
    maxAIRequests: number | null;
  };
  percentage?: {
    datasets: number;
    charts: number;
    aiRequests: number;
  };
  compact?: boolean;
}

const UserResourceUsageBadge: React.FC<UserResourceUsageBadgeProps> = ({
  usage,
  limits,
  percentage,
  compact = false,
}) => {
  const resources = [
    {
      icon: Database,
      label: "DS",
      fullLabel: "Datasets",
      current: usage.datasetsCount,
      limit: limits.maxDatasets,
      percentage: percentage?.datasets || 0,
    },
    {
      icon: BarChart3,
      label: "CH",
      fullLabel: "Charts",
      current: usage.chartsCount,
      limit: limits.maxCharts,
      percentage: percentage?.charts || 0,
    },
    {
      icon: Sparkles,
      label: "AI",
      fullLabel: "AI Requests",
      current: usage.aiRequestsCount,
      limit: limits.maxAIRequests,
      percentage: percentage?.aiRequests || 0,
    },
  ];

  const getColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 80) return "text-yellow-500";
    return "text-gray-600";
  };

  if (compact) {
    return (
      <div className="flex gap-2 text-sm">
        {resources.map((r) => {
          const Icon = r.icon;
          const isUnlimited = r.limit === null || r.limit === 0;
          return (
            <div
              key={r.label}
              className="flex items-center gap-1"
              title={r.fullLabel}
            >
              <Icon className={`w-3 h-3 ${getColor(r.percentage)}`} />
              <span className={getColor(r.percentage)}>
                {r.current}
                {!isUnlimited && `/${r.limit}`}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resources.map((r) => {
        const Icon = r.icon;
        const isUnlimited = r.limit === null || r.limit === 0;
        return (
          <div
            key={r.label}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${getColor(r.percentage)}`} />
              <span className="text-gray-700 dark:text-gray-300">
                {r.fullLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${getColor(r.percentage)}`}>
                {r.current}
                {!isUnlimited && ` / ${r.limit}`}
                {isUnlimited && (
                  <Badge variant="outline" className="ml-1 text-xs">
                    ∞
                  </Badge>
                )}
              </span>
              {!isUnlimited && r.percentage >= 80 && (
                <Badge
                  variant="outline"
                  className="text-xs text-yellow-600 border-yellow-600"
                >
                  {r.percentage}%
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserResourceUsageBadge;
