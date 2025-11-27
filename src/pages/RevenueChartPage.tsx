"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUpIcon, CalendarIcon, ArrowUpIcon } from "lucide-react"
import { RevenueLast30DaysChart } from "@/components/dashboard/RevenueLast30DaysChart"
import { systemService } from "@/services/system"

export default function RevenueChartPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["revenueLast30Days"],
    queryFn: () => systemService.getRevenueLast30Days(),
  })

  const totalRevenue = useMemo(() => data?.reduce((sum, item) => sum + item.revenue, 0) || 0, [data])
  const avgRevenue = useMemo(() => (data && data.length ? totalRevenue / data.length : 0), [data, totalRevenue])
  const maxRevenue = useMemo(() => data && data.length ? Math.max(...data.map((d) => d.revenue)) : 0, [data])
  const dayCount = data?.length || 0

  return (
    <div className="space-y-6">
      {/* Header - đồng bộ với Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Revenue Chart
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Revenue for the last 30 days (auto-updated, all completed transactions).
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm text-card-foreground rounded-xl p-5 shadow-lg border border-primary/20 hover:shadow-xl transition-all duration-300">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Today</p>
          <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards - đồng bộ style với Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Revenue (30 days)</CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">All completed transactions</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Average Daily</CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <TrendingUpIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                {avgRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Per day average</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Peak Revenue</CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <ArrowUpIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {maxRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Highest single day</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Days</CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{dayCount}</p>
              <p className="ml-2 text-sm text-muted-foreground">days</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">With transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart - đồng bộ với Dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueLast30DaysChart data={data} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}
