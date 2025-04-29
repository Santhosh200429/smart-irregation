import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Plus, Download, Filter, Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IrrigationSchedule } from "@/components/irrigation-schedule"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { db } from "@/lib/db"

export default async function SchedulePage() {
  const schedules = await db.schedules.findAll()

  // Generate upcoming events based on schedules
  const upcomingEvents = []
  const today = new Date()

  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]

    // Find schedules that run on this day
    const matchingSchedules = schedules.filter((s) => s.active && s.days.includes(dayName))

    for (const schedule of matchingSchedules) {
      upcomingEvents.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        time: schedule.time,
        name: schedule.name,
        zones: schedule.zones.map((z) => `Zone ${z}`).join(", "),
        duration: schedule.duration,
      })
    }
  }

  // Only keep the first 10 events
  const nextEvents = upcomingEvents.slice(0, 10)

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Irrigation Schedule</h1>
        <p className="text-muted-foreground">Manage your watering schedules</p>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Schedule List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="templates">Schedule Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <IrrigationSchedule initialSchedules={schedules} />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Calendar</CardTitle>
              <CardDescription>View your irrigation events on a calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduleCalendar schedules={schedules} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Irrigation Events</CardTitle>
                <CardDescription>Next 10 scheduled watering events</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextEvents.map((event, index) => (
                  <div key={index} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mr-4">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">{event.zones}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {event.date}, {event.time}
                      </div>
                      <div className="text-sm text-muted-foreground">{event.duration} minutes</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export Schedule
              </Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Water Usage Forecast</CardTitle>
                <CardDescription>Estimated water usage for upcoming events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Next 7 Days</p>
                    <p className="text-sm text-muted-foreground">Based on current schedule</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">420 L</p>
                    <p className="text-sm text-muted-foreground">Estimated usage</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weather Adjusted</p>
                    <p className="text-sm text-muted-foreground">Based on forecast</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">320 L</p>
                    <p className="text-sm text-muted-foreground">24% reduction</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common schedule operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Droplets className="mr-2 h-4 w-4" />
                  Water All Zones Now
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Skip Next Scheduled Event
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Add One-Time Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Morning Schedule</CardTitle>
                <CardDescription>Early morning watering for all zones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <span className="text-sm">5:30 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Days:</span>
                  <span className="text-sm">Mon, Wed, Fri</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Zones:</span>
                  <span className="text-sm">All Zones</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="text-sm">15 minutes per zone</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Use Template</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evening Garden</CardTitle>
                <CardDescription>Evening watering for garden areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <span className="text-sm">6:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Days:</span>
                  <span className="text-sm">Tue, Thu, Sat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Zones:</span>
                  <span className="text-sm">Garden Zones (3, 4, 5)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="text-sm">20 minutes per zone</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Use Template</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekend Deep Water</CardTitle>
                <CardDescription>Deep watering for all zones on weekends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <span className="text-sm">7:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Days:</span>
                  <span className="text-sm">Sun</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Zones:</span>
                  <span className="text-sm">All Zones (1-6)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="text-sm">30 minutes per zone</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Use Template</Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Custom Template</CardTitle>
              <CardDescription>Save your current schedule as a template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Create a custom template from your existing schedules or create a new one from scratch.</p>
              <p>Templates make it easy to quickly apply common watering patterns to your irrigation system.</p>
            </CardContent>
            <CardFooter>
              <Button>Create New Template</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
