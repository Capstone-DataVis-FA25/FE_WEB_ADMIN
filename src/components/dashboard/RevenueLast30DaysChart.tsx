"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="col-span-2 rounded-xl border border-border shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md">
            <TrendingUpIcon className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-lg font-bold">Revenue (Last 30 Days)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
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
        </div>
        {isLoading && <div className="text-sm text-muted-foreground mt-2">Đang tải...</div>}
        {error && <div className="text-sm text-destructive mt-2">Lỗi khi tải dữ liệu doanh thu</div>}
      </CardContent>
    </Card>
  )
}
