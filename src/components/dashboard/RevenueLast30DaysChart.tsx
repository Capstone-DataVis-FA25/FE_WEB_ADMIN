"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUpIcon } from "lucide-react"

interface RevenueData {
  date: string
  revenue: number
}

interface RevenueLast30DaysChartProps {
  data?: RevenueData[]
  isLoading?: boolean
  error?: Error | null
}

export function RevenueLast30DaysChart({ data, isLoading, error }: RevenueLast30DaysChartProps) {
  const chartData = useMemo(() => {
    if (!data) return []
    return data.map((item) => ({
      date: item.date,
      revenue: item.revenue,
    }))
  }, [data])

  return (
    <div className="rounded-2xl bg-card border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUpIcon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold">Revenue (Last 30 Days)</span>
            <p className="text-xs text-muted-foreground">All payment revenue analytics</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto h-[400px] p-4">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
              }
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
              tickFormatter={(value) =>
                value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })
              }
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) =>
                `${Number(value).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })}`
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        {isLoading && <div className="text-sm text-muted-foreground mt-2">Đang tải...</div>}
        {error && <div className="text-sm text-destructive mt-2">Lỗi khi tải dữ liệu doanh thu</div>}
      </div>
    </div>
  )
}
