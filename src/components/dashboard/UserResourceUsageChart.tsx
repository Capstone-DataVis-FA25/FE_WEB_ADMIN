import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, BarChart3, Sparkles } from 'lucide-react'
import type { UserResourceUsageWithId } from "@/services/resourceUsage.service"

interface UserResourceUsageChartProps {
  resourceUsageData: UserResourceUsageWithId[]
  isLoading?: boolean
}

export function UserResourceUsageChart({ resourceUsageData, isLoading }: UserResourceUsageChartProps) {
  const chartData = useMemo(() => {
    if (!resourceUsageData || resourceUsageData.length === 0) return []

    // Calculate aggregated statistics
    const totalDatasets = resourceUsageData.reduce((sum, item) => sum + item.usage.datasetsCount, 0)
    const totalCharts = resourceUsageData.reduce((sum, item) => sum + item.usage.chartsCount, 0)
    const totalAIRequests = resourceUsageData.reduce((sum, item) => sum + item.usage.aiRequestsCount, 0)

    const avgDatasets = totalDatasets / resourceUsageData.length
    const avgCharts = totalCharts / resourceUsageData.length
    const avgAIRequests = totalAIRequests / resourceUsageData.length

    return [
      {
        name: "Datasets",
        total: totalDatasets,
        average: Math.round(avgDatasets * 100) / 100,
        icon: Database,
      },
      {
        name: "Charts",
        total: totalCharts,
        average: Math.round(avgCharts * 100) / 100,
        icon: BarChart3,
      },
      {
        name: "AI Requests",
        total: totalAIRequests,
        average: Math.round(avgAIRequests * 100) / 100,
        icon: Sparkles,
      },
    ]
  }, [resourceUsageData])

  if (isLoading) {
    return (
      <Card className="col-span-2 rounded-xl border border-border shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold">User Resource Usage</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </CardContent>
      </Card>
    )
  }

  if (!resourceUsageData || resourceUsageData.length === 0) {
    return (
      <Card className="col-span-2 rounded-xl border border-border shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold">User Resource Usage</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Không có dữ liệu</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-2 rounded-xl border border-border shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md">
            <Database className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-lg font-bold">User Resource Usage</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
              <XAxis 
                dataKey="name" 
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
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))', 
                  borderRadius: '8px' 
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => {
                  if (name === 'total') return [value.toLocaleString(), 'Tổng']
                  if (name === 'average') return [value.toLocaleString(), 'Trung bình']
                  return [value, name]
                }}
              />
              <Legend 
                formatter={(value) => {
                  if (value === 'total') return 'Tổng'
                  if (value === 'average') return 'Trung bình'
                  return value
                }}
              />
              <Bar 
                dataKey="total" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
                name="total"
              />
              <Bar 
                dataKey="average" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]}
                name="average"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

