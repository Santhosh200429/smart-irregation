"use client"

import { useState } from "react"
import { Edit, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createScheduleAction, toggleScheduleAction, deleteScheduleAction, updateSmartRulesAction } from "@/lib/actions"
import type { ScheduleData } from "@/lib/types"

interface IrrigationScheduleProps {
  initialSchedules: ScheduleData[]
}

export function IrrigationSchedule({ initialSchedules }: IrrigationScheduleProps) {
  const [schedules, setSchedules] = useState(initialSchedules)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    time: "05:30",
    duration: "15",
    days: [] as string[],
    zones: [] as number[],
  })
  const [smartRules, setSmartRules] = useState({
    weatherAdjust: true,
    moistureAdjust: true,
    seasonalAdjust: true,
  })
  const { toast } = useToast()

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const toggleSchedule = async (id: number) => {
    try {
      const updatedSchedule = await toggleScheduleAction(id)
      setSchedules(schedules.map((schedule) => (schedule.id === id ? updatedSchedule : schedule)))

      toast({
        title: updatedSchedule.active ? "Schedule activated" : "Schedule deactivated",
        description: `${updatedSchedule.name} has been ${updatedSchedule.active ? "activated" : "deactivated"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteSchedule = async (id: number) => {
    try {
      await deleteScheduleAction(id)
      setSchedules(schedules.filter((schedule) => schedule.id !== id))

      toast({
        title: "Schedule deleted",
        description: "The irrigation schedule has been deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter((d) => d !== day) }
      } else {
        return { ...prev, days: [...prev.days, day] }
      }
    })
  }

  const handleZoneToggle = (zone: number) => {
    setFormData((prev) => {
      if (prev.zones.includes(zone)) {
        return { ...prev, zones: prev.zones.filter((z) => z !== zone) }
      } else {
        return { ...prev, zones: [...prev.zones, zone] }
      }
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      if (!formData.name) {
        toast({
          title: "Missing information",
          description: "Please provide a name for the schedule.",
          variant: "destructive",
        })
        return
      }

      if (formData.days.length === 0) {
        toast({
          title: "Missing information",
          description: "Please select at least one day for the schedule.",
          variant: "destructive",
        })
        return
      }

      if (formData.zones.length === 0) {
        toast({
          title: "Missing information",
          description: "Please select at least one zone for the schedule.",
          variant: "destructive",
        })
        return
      }

      const newSchedule = await createScheduleAction({
        name: formData.name,
        time: formData.time,
        duration: Number.parseInt(formData.duration),
        days: formData.days,
        zones: formData.zones,
      })

      setSchedules([...schedules, newSchedule])
      setOpen(false)
      setFormData({
        name: "",
        time: "05:30",
        duration: "15",
        days: [],
        zones: [],
      })

      toast({
        title: "Schedule created",
        description: "New irrigation schedule has been created.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSmartRules = async () => {
    try {
      await updateSmartRulesAction(smartRules)

      toast({
        title: "Smart rules updated",
        description: "Smart scheduling rules have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update smart rules. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Irrigation Schedules</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Schedule</DialogTitle>
              <DialogDescription>Set up a new irrigation schedule for your zones.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  placeholder="Morning Routine"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="time">Start Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Days</Label>
                <div className="flex flex-wrap gap-2">
                  {weekdays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={formData.days.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <label
                        htmlFor={`day-${day}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Zones</Label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((zone) => (
                    <div key={zone} className="flex items-center space-x-2">
                      <Checkbox
                        id={`zone-${zone}`}
                        checked={formData.zones.includes(zone)}
                        onCheckedChange={() => handleZoneToggle(zone)}
                      />
                      <label
                        htmlFor={`zone-${zone}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {zone}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Schedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Active</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Zones</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <Checkbox
                      checked={schedule.active}
                      onCheckedChange={() => toggleSchedule(schedule.id)}
                      aria-label={`Toggle ${schedule.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{schedule.name}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell>{schedule.days.join(", ")}</TableCell>
                  <TableCell>{schedule.zones.map((z) => `Zone ${z}`).join(", ")}</TableCell>
                  <TableCell>{schedule.duration} min</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/schedule/${schedule.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSchedule(schedule.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Smart Scheduling</CardTitle>
          <CardDescription>Automatically adjust irrigation based on weather and soil conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="weather-adjust"
              checked={smartRules.weatherAdjust}
              onCheckedChange={(checked) => setSmartRules({ ...smartRules, weatherAdjust: checked === true })}
            />
            <label htmlFor="weather-adjust" className="text-sm font-medium leading-none">
              Adjust watering based on weather forecast
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="moisture-adjust"
              checked={smartRules.moistureAdjust}
              onCheckedChange={(checked) => setSmartRules({ ...smartRules, moistureAdjust: checked === true })}
            />
            <label htmlFor="moisture-adjust" className="text-sm font-medium leading-none">
              Skip watering when soil moisture is above threshold
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seasonal-adjust"
              checked={smartRules.seasonalAdjust}
              onCheckedChange={(checked) => setSmartRules({ ...smartRules, seasonalAdjust: checked === true })}
            />
            <label htmlFor="seasonal-adjust" className="text-sm font-medium leading-none">
              Apply seasonal adjustments automatically
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={updateSmartRules}>
            Configure Smart Rules
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
