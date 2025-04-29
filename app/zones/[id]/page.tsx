import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { db } from "@/lib/db"
import { ZoneHistoryChart } from "@/components/zone-history-chart"

interface ZoneDetailPageProps {
  params: {
    id: string
  }
}

export default async function ZoneDetailPage({ params }: ZoneDetailPageProps) {
  const zoneId = Number.parseInt(params.id)

  if (isNaN(zoneId)) {
    notFound()
  }

  const zone = await db.zones.findById(zoneId)

  if (!zone) {
    notFound()
  }

  // In a real app, we would fetch historical data for this zone
  // For now, we'll generate some mock data
  const mockHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      moisture: Math.floor(Math.random() * 20) + 55, // Random between 55-75
      watering: Math.random() > 0.7, // 30% chance of watering on any day
    }
  })

  const getMoistureColor = (level: number) => {
    if (level < 50) return "text-red-500"
    if (level < 60) return "text-amber-500"
    if (level <= 75) return "text-green-600"
    return "text-blue-500"
  }

  const getMoistureStatus = (level: number) => {
    if (level < 50) return "Dry"
    if (level < 60) return "Slightly Dry"
    if (level <= 75) return "Optimal"
    return "Wet"
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          Zone {zoneId}: {zone.name}
        </h1>
        <p className="text-muted-foreground">{zone.active ? "Currently irrigating" : "Irrigation off"}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Real-time zone information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Soil Moisture</span>
                <span className={getMoistureColor(zone.moisture)}>
                  {zone.moisture}% ({getMoistureStatus(zone.moisture)})
                </span>
              </div>
              <Progress value={zone.moisture} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Last Watered</h3>
                <p className="text-muted-foreground">{zone.lastWatered}</p>
              </div>
              <div>
                <h3 className="font-medium">Next Scheduled</h3>
                <p className="text-muted-foreground">{zone.nextScheduled}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <p className={zone.active ? "text-green-600" : "text-muted-foreground"}>
                  {zone.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Sensor ID</h3>
                <p className="text-muted-foreground">SENSOR-{zoneId.toString().padStart(3, "0")}</p>
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full">
                <Droplets className="mr-2 h-4 w-4" />
                Water Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone History</CardTitle>
            <CardDescription>Moisture levels and watering events</CardDescription>
          </CardHeader>
          <CardContent>
            <ZoneHistoryChart data={mockHistory} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Zone Settings</CardTitle>
            <CardDescription>Configure zone-specific parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Watering Parameters</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Optimal Moisture Range:</span>
                    <span className="text-sm font-medium">60-75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Flow Rate:</span>
                    <span className="text-sm font-medium">2.5 L/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Default Duration:</span>
                    <span className="text-sm font-medium">15 minutes</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Smart Adjustments</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Weather Adjustment:</span>
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Moisture Threshold:</span>
                    <span className="text-sm font-medium">55%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Seasonal Adjustment:</span>
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline">Edit Zone Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
