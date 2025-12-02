
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import * as Tabs from "@radix-ui/react-tabs"

import { RevenueLast30DaysChart } from "@/components/dashboard/RevenueLast30DaysChart"
import { systemService } from "@/services/system"
import AdminTransactionFeed from "@/components/admin/AdminTransactionFeed"

export default function RevenueChartPage() {
  const [tab, setTab] = useState("transactions")

  const { data: chartData, isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ["revenueLast30Days"],
    queryFn: () => systemService.getRevenueLast30Days(),
  })

  return (
    <Tabs.Root value={tab} onValueChange={setTab} className="space-y-6">
      <Tabs.List className="mb-4 flex gap-2 bg-muted/40 rounded-lg p-1 border border-slate-200 dark:border-slate-800 w-fit mx-auto shadow-sm">
        <Tabs.Trigger
          value="transactions"
          className="px-6 py-2 rounded-lg font-semibold text-base transition-all duration-150 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          Transactions
        </Tabs.Trigger>
        <Tabs.Trigger
          value="chart"
          className="px-6 py-2 rounded-lg font-semibold text-base transition-all duration-150 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          Revenue Chart
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="transactions">
        <div className="max-h-[600px] overflow-y-auto">
          <AdminTransactionFeed />
        </div>
      </Tabs.Content>
      <Tabs.Content value="chart">
        <div className="max-h-[600px] overflow-y-auto">
          <RevenueLast30DaysChart data={chartData} isLoading={chartLoading} error={chartError} />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}
