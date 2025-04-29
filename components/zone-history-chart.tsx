"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface ZoneHistoryData {
  date: string
  moisture: number
  watering: boolean
}

interface ZoneHistoryChartProps {
  data: ZoneHistoryData[]
}

export function ZoneHistoryChart({ data }: ZoneHistoryChartProps) {
  return (
    <ChartContainer
      config={{
        moisture: {
          label: "Soil Moisture",
          color: "hsl(var(--chart-1))",
        },
        watering: {
          label: "Watering Event",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" tickFormatter={(value, index) => (index % 3 === 0 ? value : "")} />
          <YAxis domain={[40, 90]} className="text-xs" />
          <Tooltip
            formatter={(value, name) => {
              if (name === "watering") {
                return [value ? "Yes" : "No", "Watering"]
              }
              return [`${value}%`, "Moisture"]
            }}
          />
          <Bar dataKey="moisture" fill="var(--color-moisture)" radius={[4, 4, 0, 0]} />
          <ReferenceLine y={60} stroke="#10b981" strokeDasharray="3 3" />
          <ReferenceLine y={75} stroke="#10b981" strokeDasharray="3 3" />
          {data.map(
            (entry, index) =>
              entry.watering && (
                <ReferenceLine key={`ref-${index}`} x={index} stroke="var(--color-watering)" strokeWidth={2} />
              ),
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
