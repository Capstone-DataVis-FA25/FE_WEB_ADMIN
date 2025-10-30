import type React from "react"

import { useEffect, useState, useRef } from "react"
import { io, type Socket } from "socket.io-client"
import { useQuery } from "@tanstack/react-query"
import { systemService } from "@/services/system"
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
  AlertCircle,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import type { Activity } from "@/types/system.types"

type ActivityFeedProps = { showHeader?: boolean }

type IconType = React.ComponentType<{ className?: string }>

type IconSpec = {
  Icon: IconType
  colorClass: string
  bgClass: string
  label?: string
}

const actionToIcon: Record<string, IconSpec> = {
  user_register: {
    Icon: UserPlus,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
    label: "USER",
  },
  lock_user: {
    Icon: Lock,
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-100 dark:bg-red-900/30",
    label: "USER",
  },
  unlock_user: {
    Icon: Unlock,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    label: "USER",
  },
  block_user: {
    Icon: Lock,
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-100 dark:bg-red-900/30",
    label: "USER",
  },
  create_dataset: {
    Icon: Database,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    label: "DATASET",
  },
  create_chart: {
    Icon: BarChart3,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    label: "CHART",
  },
  delete_self_account: {
    Icon: Trash2,
    colorClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-100 dark:bg-rose-900/30",
    label: "USER",
  },
}

const getIconForAction = (action?: string): IconSpec => {
  if (!action)
    return {
      Icon: Bell as unknown as IconType,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-100 dark:bg-blue-900/30",
    }
  const key = action.toLowerCase()
  if (key.includes("lock")) return actionToIcon.lock_user
  if (key.includes("unlock")) return actionToIcon.unlock_user
  if (key.includes("block")) return actionToIcon.block_user
  return (
    actionToIcon[key] ?? {
      Icon: Bell as unknown as IconType,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-100 dark:bg-blue-900/30",
    }
  )
}

const formatActivityDetails = (activity: Activity): string => {
  const { action, metadata } = activity

  if (metadata?.description) {
    return metadata.description as string
  }

  switch (action?.toLowerCase()) {
    case "user_register":
      return `New user registered: ${metadata?.email || "Unknown"}`
    case "lock_user":
    case "block_user":
      if (metadata?.targetUser) {
        const targetUser = metadata.targetUser as {
          name: string
          email: string
        }
        const actor = metadata.actor as { name: string }
        return `${actor?.name || "Admin"} ${
          action.toLowerCase().includes("lock") ? "locked" : "blocked"
        } user ${targetUser.name || targetUser.email}`
      }
      return `User locked: ${metadata?.userId || "Unknown"}`
    case "unlock_user":
      if (metadata?.targetUser) {
        const targetUser = metadata.targetUser as {
          name: string
          email: string
        }
        const actor = metadata.actor as { name: string }
        return `${actor?.name || "Admin"} unlocked user ${targetUser.name || targetUser.email}`
      }
      return `User unlocked: ${metadata?.userId || "Unknown"}`
    case "create_dataset":
      return `Dataset created: ${metadata?.name || "Unnamed dataset"}`
    case "create_chart":
      return `Chart created: ${metadata?.name || "Unnamed chart"} (${metadata?.type || "Unknown type"})`
    case "delete_self_account":
      if (metadata?.actor) {
        const actor = metadata.actor as { name: string; email: string }
        return `User deleted their account: ${actor.name || actor.email}`
      }
      return "User deleted their account"
    default:
      return activity.resource || action || "Unknown activity"
  }
}

const getAdditionalDetails = (activity: Activity): Record<string, unknown> | null => {
  const { metadata } = activity

  if (metadata) {
    const additionalDetails: Record<string, unknown> = { ...metadata }
    delete additionalDetails.description
    delete additionalDetails.actor
    delete additionalDetails.targetUser

    if (Object.keys(additionalDetails).length > 0) {
      return additionalDetails
    }
  }

  return null
}

export default function ActivityFeed({ showHeader = true }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const socketRef = useRef<Socket | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ["activityHistory"],
    queryFn: async () => systemService.getActivityLog(),
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (data) setActivities(data)
  }, [data])

  useEffect(() => {
    const wsUrl = "/admin-activity"
    const socket: Socket = io(wsUrl, {
      path: "/socket.io",
      transports: ["websocket"],
    })
    socketRef.current = socket
    socket.on("connect", () => console.log("ws connected", socket.id))
    socket.on("activity:created", (act: Activity) => {
      setActivities((prev) => [act, ...prev].slice(0, 200))
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="rounded-lg bg-card border border-border shadow-sm">
        {showHeader && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Activity Feed</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Real-time system events</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Clock className="w-6 h-6 text-muted-foreground animate-spin" />
            <p className="text-sm text-muted-foreground">Loading activities...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-card border border-border shadow-sm">
        {showHeader && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold">Activity Feed</h2>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-12 text-center p-6">
          <div className="p-3 rounded-full bg-destructive/10 mb-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium mb-1">Error loading activities</p>
          <p className="text-sm text-muted-foreground mb-4">Failed to fetch activity data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-card border border-border shadow-sm overflow-hidden">
      {showHeader && (
        <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Activity Feed</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time system events</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full flex items-center gap-1.5 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Live
          </span>
        </div>
      )}
      <div className="max-h-[500px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {activities.map((a: Activity) => {
            const dt = new Date(a.createdAt)
            const spec = getIconForAction(a.action)
            const isOpen = !!expanded[a.id]
            const details = formatActivityDetails(a)
            const additionalDetails = getAdditionalDetails(a)

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
                className="p-4 border-b border-border/50 last:border-b-0 hover:bg-accent/40 transition-colors"
                layout
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    <div
                      className={`w-9 h-9 rounded-lg ${spec.bgClass} ${spec.colorClass} flex items-center justify-center`}
                    >
                      <spec.Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-sm text-foreground">{details}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {dt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground font-medium">{spec.label ?? ""}</div>
                    <div className="text-sm text-muted-foreground truncate mt-1">{a.resource}</div>
                    {(additionalDetails || a.metadata) && (
                      <div className="mt-3">
                        <button
                          onClick={() => setExpanded((s) => ({ ...s, [a.id]: !isOpen }))}
                          className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                          aria-expanded={isOpen}
                        >
                          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          {isOpen ? "Hide details" : "Show details"}
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.pre
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="text-xs mt-2 p-3 bg-muted/50 rounded-lg overflow-x-auto font-mono"
                            >
                              {JSON.stringify(additionalDetails || a.metadata, null, 2)}
                            </motion.pre>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {activities.length === 0 && (
          <div className="p-8 text-center">
            <div className="p-3 rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No activities yet</p>
            <p className="text-xs text-muted-foreground mt-1">System events will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
