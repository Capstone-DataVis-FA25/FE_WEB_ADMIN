"use client"

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
  ActivityIcon,
  Info,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { userService } from "@/services/user"
import type { Activity } from "@/types/system.types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
    label: "SECURITY",
  },
  unlock_user: {
    Icon: Unlock,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    label: "SECURITY",
  },
  block_user: {
    Icon: Lock,
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-100 dark:bg-red-900/30",
    label: "SECURITY",
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
    label: "ACCOUNT",
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
      Icon: ActivityIcon as unknown as IconType,
      colorClass: "text-slate-600 dark:text-slate-400",
      bgClass: "bg-slate-100 dark:bg-slate-800",
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
    // Remove fields that are already displayed in the main text
    delete additionalDetails.description
    delete additionalDetails.actor
    delete additionalDetails.targetUser
    delete additionalDetails.email // Often redundant if in title
    delete additionalDetails.name // Often redundant

    if (Object.keys(additionalDetails).length > 0) {
      return additionalDetails
    }
  }

  return null
}

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className="grid grid-cols-[120px_1fr] gap-2 text-xs py-1 border-b border-slate-200 dark:border-slate-800 last:border-0">
    <span className="font-medium text-muted-foreground capitalize">{label.replace(/([A-Z])/g, " $1").trim()}</span>
    <span className="text-foreground font-mono break-all">
      {typeof value === "object" ? JSON.stringify(value) : String(value)}
    </span>
  </div>
)

function ActivityDetails({
  activity,
  isOpen,
  onToggle,
}: {
  activity: Activity
  isOpen: boolean
  onToggle: () => void
}) {
  // resolve actorId from top-level or metadata
  const actorId = (activity as any).actorId ?? (activity.metadata as any)?.actor?.id

  const { data: actorData } = useQuery({
    queryKey: actorId ? ["user", actorId] : ["user", "unknown"],
    queryFn: () => userService.getUserById(actorId as string),
    enabled: !!actorId,
    staleTime: 5 * 60 * 1000,
  })

  // build a display activity that injects actor info into metadata for formatting
  const displayActor = (activity.metadata as any)?.actor ??
    (actorData ? { id: actorData.id, name: (actorData as any).name ?? (actorData as any).firstName ?? (actorData as any).email, email: (actorData as any).email } : undefined)

  const displayActivity: Activity = {
    ...activity,
    metadata: {
      ...(activity.metadata ?? {}),
      ...(displayActor ? { actor: displayActor } : {}),
    } as Record<string, unknown>,
  }

  const details = formatActivityDetails(displayActivity)
  const additionalDetails = getAdditionalDetails(displayActivity)

  const dt = new Date(activity.createdAt)

  return (
    <>
      <div className="p-3 flex gap-3 group" onClick={() => additionalDetails && onToggle()}>
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-foreground leading-none mb-1.5">{details}</p>
              {/* show actor name/email or fallback to actorId when available */}
              <div className="text-xs text-muted-foreground">
                {displayActor?.name ? (
                  <>
                    <span className="font-medium">{displayActor.name}</span>
                    {displayActor?.email && <span className="ml-2">• {displayActor.email}</span>}
                    {displayActor?.id && <span className="ml-2 font-mono text-[11px]">({displayActor.id})</span>}
                  </>
                ) : actorId ? (
                  <span className="font-mono">Actor ID: {actorId}</span>
                ) : (
                  <span>Không rõ người thực hiện</span>
                )}
              </div>
            </div>

            <span className="text-[10px] text-muted-foreground whitespace-nowrap font-mono bg-muted/50 px-1.5 py-0.5 rounded">
              {dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* label and date handled by parent visuals if desired */}
            <span className="text-xs text-muted-foreground truncate">{dt.toLocaleDateString()}</span>
          </div>
        </div>

        {additionalDetails && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200 mt-1",
              isOpen && "rotate-180",
            )}
          />
        )}
      </div>

      <AnimatePresence>
        {isOpen && additionalDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0 pl-[52px]">
              <div className="bg-background/50 rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-xs">
                <div className="flex items-center gap-2 mb-2 font-medium text-muted-foreground">
                  <Info className="w-3 h-3" />
                  Event Details
                </div>
                <div className="space-y-1">
                  {Object.entries(additionalDetails).map(([key, value]) => (
                    <DetailRow key={key} label={key} value={value} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
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
      <div className="rounded-2xl bg-card border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
        {showHeader && (
          <div className="p-4 border-b flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Activity Feed</h2>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center p-8">
          <Clock className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-card border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-8 h-8 text-destructive mb-2" />
          <p className="text-sm font-medium">Failed to load activities</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ActivityIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Activity Feed</h2>
              <p className="text-xs text-muted-foreground">Recent system events</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-background/50 backdrop-blur text-[10px] h-5 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Live
          </Badge>
        </div>
      )}

      <div className="flex-1 overflow-y-auto h-[500px]">
        <div className="p-4 space-y-2">
          <AnimatePresence initial={false}>
            {activities.map((a: Activity) => {
              const spec = getIconForAction(a.action)
              const isOpen = !!expanded[a.id]

              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "rounded-xl transition-all duration-200 border",
                    isOpen
                      ? "bg-muted/50 border-slate-200 dark:border-slate-800 shadow-sm"
                      : "border-transparent hover:bg-muted/30 hover:border-slate-200/50 dark:hover:border-slate-800/50",
                  )}
                >
                  <div className={cn("p-3 flex gap-3", isOpen ? "group bg-muted/10" : "group") }>
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm",
                        spec.bgClass,
                        spec.colorClass,
                      )}
                    >
                      <spec.Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <ActivityDetails
                        activity={a}
                        isOpen={isOpen}
                        onToggle={() => setExpanded((s) => ({ ...s, [a.id]: !isOpen }))}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {activities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground mt-1">System events will appear here in real-time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
