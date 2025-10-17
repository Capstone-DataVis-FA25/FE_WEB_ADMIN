import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import type { Activity } from "@/types";
import { systemService } from "@/services/system";
import {
  Bell,
  Clock,
  UserPlus,
  Lock,
  Unlock,
  Database,
  BarChart3,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ActivityFeedProps = { showHeader?: boolean };

type IconType = React.ComponentType<{ className?: string }>;

type IconSpec = {
  Icon: IconType;
  colorClass: string;
  bgClass: string;
  label?: string;
};

const actionToIcon: Record<string, IconSpec> = {
  user_register: {
    Icon: UserPlus,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-100 dark:bg-emerald-900",
    label: "USER",
  },
  block_user: {
    Icon: Lock,
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-100 dark:bg-red-900",
    label: "USER",
  },
  unlock_user: {
    Icon: Unlock,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-900",
    label: "USER",
  },
  create_dataset: {
    Icon: Database,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-900",
    label: "DATASET",
  },
  create_chart: {
    Icon: BarChart3,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-100 dark:bg-purple-900",
    label: "CHART",
  },
  delete_self_account: {
    Icon: Trash2,
    colorClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-100 dark:bg-rose-900",
    label: "USER",
  },
};

const getIconForAction = (action?: string): IconSpec => {
  if (!action)
    return {
      Icon: Bell as unknown as IconType,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-100 dark:bg-blue-900",
    };
  const key = action.toLowerCase();
  if (key.startsWith("lock")) return actionToIcon.block_user;
  if (key.startsWith("unlock")) return actionToIcon.unlock_user;
  return (
    actionToIcon[key] ?? {
      Icon: Bell as unknown as IconType,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-100 dark:bg-blue-900",
    }
  );
};

export default function ActivityFeed({ showHeader = true }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const socketRef = useRef<Socket | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["activityHistory"],
    queryFn: async () => systemService.getActivityLog(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) setActivities(data);
  }, [data]);

  useEffect(() => {
    const wsUrl = "/admin-activity";
    const socket: Socket = io(wsUrl, {
      path: "/socket.io",
      transports: ["websocket"],
    });
    socketRef.current = socket;
    socket.on("connect", () => console.log("ws connected", socket.id));
    socket.on("activity:created", (act: Activity) => {
      setActivities((prev) => [act, ...prev].slice(0, 200));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-4">
        {showHeader && (
          <h2 className="text-xl font-semibold mb-3">Activity Feed</h2>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2 animate-spin" />
          Loading activities...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        {showHeader && (
          <h2 className="text-xl font-semibold mb-3">Activity Feed</h2>
        )}
        <div className="text-red-500">Error loading activities</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Activity Feed</h2>
          </div>
          <span className="text-xs text-muted-foreground">Realtime</span>
        </div>
      )}
      <div className="max-h-[60vh] overflow-auto divide-y rounded-lg border bg-card">
        <AnimatePresence initial={false}>
          {activities.map((a: Activity) => {
            const dt = new Date(a.createdAt);
            const spec = getIconForAction(a.action);
            const isOpen = !!expanded[a.id];
            return (
              <motion.div
                key={a.id}
                initial={{
                  opacity: 0,
                  y: 18,
                  backgroundColor: "rgba(59,130,246,0.10)",
                }}
                animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="p-3 hover:bg-accent/40 transition-colors"
                layout
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <div
                      className={`w-7 h-7 rounded-full ${spec.bgClass} ${spec.colorClass} flex items-center justify-center`}
                    >
                      <spec.Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium truncate">{a.action}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {dt.toLocaleDateString()} {dt.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-xs mt-0.5 text-muted-foreground">
                      {spec.label ?? ""}
                    </div>
                    <div className="text-sm truncate">{a.resource}</div>
                    {a.metadata && (
                      <div className="mt-2">
                        <button
                          onClick={() =>
                            setExpanded((s) => ({ ...s, [a.id]: !isOpen }))
                          }
                          className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          aria-expanded={isOpen}
                        >
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                          {isOpen ? "Hide details" : "Show details"}
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.pre
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="text-xs mt-2 p-2 bg-muted/50 rounded overflow-x-auto"
                            >
                              {JSON.stringify(a.metadata, null, 2)}
                            </motion.pre>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {activities.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground">
            No activities yet.
          </div>
        )}
      </div>
    </div>
  );
}
