import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/db"

export default async function SettingsPage() {
  const smartRules = await db.settings.getSmartRules()

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Configure your smart irrigation system</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Basic system details and configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" defaultValue="Home Irrigation System" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="Backyard" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="America/Los_Angeles" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="units">Units</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="metric" name="units" defaultChecked />
                      <label htmlFor="metric">Metric (°C, mm)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="imperial" name="units" />
                      <label htmlFor="imperial">Imperial (°F, in)</label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Watering</CardTitle>
                <CardDescription>Configure automatic adjustments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weather-adjust">Weather-based Adjustments</Label>
                    <p className="text-sm text-muted-foreground">Adjust watering based on weather forecast</p>
                  </div>
                  <Switch id="weather-adjust" defaultChecked={smartRules.weatherAdjust} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="moisture-adjust">Moisture-based Skipping</Label>
                    <p className="text-sm text-muted-foreground">Skip watering when soil is already moist</p>
                  </div>
                  <Switch id="moisture-adjust" defaultChecked={smartRules.moistureAdjust} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="seasonal-adjust">Seasonal Adjustments</Label>
                    <p className="text-sm text-muted-foreground">Automatically adjust for seasonal changes</p>
                  </div>
                  <Switch id="seasonal-adjust" defaultChecked={smartRules.seasonalAdjust} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="moisture-threshold">Moisture Threshold (%)</Label>
                  <Input id="moisture-threshold" type="number" defaultValue="60" />
                  <p className="text-xs text-muted-foreground">Skip watering when moisture is above this level</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zones">
          <Card>
            <CardHeader>
              <CardTitle>Zone Configuration</CardTitle>
              <CardDescription>Manage irrigation zones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Configure individual zones, sensors, and watering parameters</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((zoneId) => (
                  <Card key={zoneId}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Zone {zoneId}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={`/zones/${zoneId}`}>Configure Zone</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>Add New Zone</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Management</CardTitle>
              <CardDescription>Configure watering schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Manage irrigation schedules and automation rules</p>
              <Button asChild>
                <Link href="/schedule">Manage Schedules</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive system alerts via email</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email-address">Email Address</Label>
                <Input id="email-address" type="email" defaultValue="user@example.com" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts on your mobile device</p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Notification Events</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-low-moisture" defaultChecked />
                    <label htmlFor="notify-low-moisture">Low moisture alerts</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-system-issues" defaultChecked />
                    <label htmlFor="notify-system-issues">System issues</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-schedule-changes" defaultChecked />
                    <label htmlFor="notify-schedule-changes">Schedule changes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-watering-complete" />
                    <label htmlFor="notify-watering-complete">Watering complete</label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>System configuration and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" type="password" value="••••••••••••••••" readOnly />
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-xs text-muted-foreground">Used for external integrations and API access</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="data-retention">Data Retention (days)</Label>
                <Input id="data-retention" type="number" defaultValue="90" />
              </div>
              <div className="pt-4 space-y-2">
                <h3 className="font-medium">System Maintenance</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">Backup System</Button>
                  <Button variant="outline">Restore Backup</Button>
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button variant="outline">Check for Updates</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
