import ActivityFeed from "@/components/admin/ActivityFeed"

export default function ActivityFeedPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          System Activity
        </h1>
        <p className="text-muted-foreground">
          Real-time log of all system events and user actions.
        </p>
      </div>
      
      <ActivityFeed showHeader={true} />
    </div>
  )
}
