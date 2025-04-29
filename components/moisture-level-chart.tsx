"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { MoistureHistoryData } from "@/lib/types"

interface MoistureLevelChartProps {
  data: MoistureHistoryData[]
}

export function MoistureLevelChart({ data }: MoistureLevelChartProps) {
  return (
    <ChartContainer
      config={{
        zone1: {
          label: "Zone 1 - Front Lawn",
          color: "hsl(var(--chart-1))",
        },
        zone2: {
          label: "Zone 2 - Back Lawn",
          color: "hsl(var(--chart-2))",
        },
        zone3: {
          label: "Zone 3 - Garden Beds",
          color: "hsl(var(--chart-3))",
        },
        zone4: {
          label: "Zone 4 - Vegetable Garden",
          color: "hsl(var(--chart-4))",
        },
        zone5: {
          label: "Zone 5 - Flower Beds",
          color: "hsl(var(--chart-5))",
        },
        zone6: {
          label: "Zone 6 - Shrubs",
          color: "hsl(var(--chart-6))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-sm" />
          <YAxis domain={[50, 80]} className="text-sm" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="zone1" stroke="var(--color-zone1)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="zone2" stroke="var(--color-zone2)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="zone3" stroke="var(--color-zone3)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="zone4" stroke="var(--color-zone4)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="zone5" stroke="var(--color-zone5)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="zone6" stroke="var(--color-zone6)" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
