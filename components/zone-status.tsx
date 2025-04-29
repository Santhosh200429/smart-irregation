"use client"

import { useState } from "react"
import { Droplets } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { toggleZoneAction, waterZoneNowAction } from "@/lib/actions"
import type { ZoneData } from "@/lib/types"

interface ZoneStatusProps {
  initialZones: ZoneData[]
}

export function ZoneStatus({ initialZones }: ZoneStatusProps) {
  const [zones, setZones] = useState(initialZones)
  const [loading, setLoading] = useState<number | null>(null)
  const [wateringZone, setWateringZone] = useState<number | null>(null)
  const { toast } = useToast()

  const toggleZone = async (id: number) => {
    try {
      setLoading(id)
      const updatedZone = await toggleZoneAction(id)

      setZones(zones.map((zone) => (zone.id === id ? updatedZone : zone)))

      toast({
        title: updatedZone.active ? "Zone activated" : "Zone deactivated",
        description: `Zone ${id}: ${updatedZone.name} has been ${updatedZone.active ? "turned on" : "turned off"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle zone. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const waterZoneNow = async (id: number) => {
    try {
      setWateringZone(id)
      await waterZoneNowAction(id)

      toast({
        title: "Watering started",
        description: `Manual watering started for Zone ${id}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start watering. Please try again.",
        variant: "destructive",
      })
    } finally {
      setWateringZone(null)
    }
  }

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {zones.map((zone) => (
        <Card key={zone.id} className={zone.active ? "border-green-200 bg-green-50/30 dark:bg-green-900/10" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Zone {zone.id}: {zone.name}
              </CardTitle>
              <Switch
                checked={zone.active}
                onCheckedChange={() => toggleZone(zone.id)}
                disabled={loading === zone.id}
                aria-label={`Toggle Zone ${zone.id}`}
              />
            </div>
            <CardDescription>{zone.active ? "Currently irrigating" : "Irrigation off"}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="mb-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Soil Moisture</span>
                <span className={getMoistureColor(zone.moisture)}>
                  {zone.moisture}% ({getMoistureStatus(zone.moisture)})
                </span>
              </div>
              <Progress value={zone.moisture} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Last Watered:</p>
                <p>{zone.lastWatered}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next Scheduled:</p>
                <p>{zone.nextScheduled}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => waterZoneNow(zone.id)}
              disabled={wateringZone === zone.id || zone.active}
            >
              <Droplets className="mr-2 h-4 w-4" />
              {wateringZone === zone.id ? "Starting..." : "Water Now"}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`/zones/${zone.id}`}>View Details</a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
