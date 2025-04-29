"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface WeatherImpactData {
  date: string
  scheduledWater: number
  adjustedWater: number
  rainfall: number
}

interface WeatherImpactChartProps {
  data: WeatherImpactData[]
}

export function WeatherImpactChart({ data }: WeatherImpactChartProps) {
  return (
    <ChartContainer
      config={{
        scheduledWater: {
          label: "Scheduled Water",
          color: "hsl(var(--chart-1))",
        },
        adjustedWater: {
          label: "Adjusted Water",
          color: "hsl(var(--chart-2))",
        },
        rainfall: {
          label: "Rainfall",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-sm" />
          <YAxis className="text-sm" />
          <Tooltip />
          <Legend />
          <Bar dataKey="scheduledWater" fill="var(--color-scheduledWater)" fillOpacity={0.3} />
          <Bar dataKey="adjustedWater" fill="var(--color-adjustedWater)" />
          <Bar dataKey="rainfall" fill="var(--color-rainfall)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
