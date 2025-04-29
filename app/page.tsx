import Link from "next/link"
import { Droplets, Home, Calendar, Settings, Cloud, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoistureLevelChart } from "@/components/moisture-level-chart"
import { WeatherForecast } from "@/components/weather-forecast"
import { ZoneStatus } from "@/components/zone-status"
import { IrrigationSchedule } from "@/components/irrigation-schedule"
import { SystemOverview } from "@/components/system-overview"
import { getDashboardData } from "@/lib/data-service"

export default async function DashboardPage() {
  const dashboardData = await getDashboardData()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 lg:block lg:w-64">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Droplets className="h-6 w-6 text-green-600" />
              <span>Smart Irrigation</span>
            </Link>
          </div>
          <div className="flex-1 px-4 py-4">
            <nav className="flex flex-col gap-1">
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link href="/zones">
                  <BarChart3 className="h-4 w-4" />
                  Zones
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link href="/schedule">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link href="/weather">
                  <Cloud className="h-4 w-4" />
                  Weather
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <div className="lg:hidden">
            <Droplets className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Tabs defaultValue="overview">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="zones">Zones</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
                <Button size="sm">System Settings</Button>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-4 pt-4">
              <SystemOverview data={dashboardData.overview} />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Soil Moisture Levels</CardTitle>
                    <CardDescription>Last 7 days across all zones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MoistureLevelChart data={dashboardData.moistureHistory} />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Weather Forecast</CardTitle>
                    <CardDescription>5-day forecast for your location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WeatherForecast forecast={dashboardData.weatherForecast} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="zones" className="space-y-4 pt-4">
              <ZoneStatus initialZones={dashboardData.zones} />
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 pt-4">
              <IrrigationSchedule initialSchedules={dashboardData.schedules} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
