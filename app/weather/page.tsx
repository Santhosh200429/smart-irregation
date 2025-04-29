import Link from "next/link"
import { ArrowLeft, Cloud, CloudDrizzle, CloudRain, Download, Sun, CloudSun, Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/db"
import { WeatherImpactChart } from "@/components/weather-impact-chart"

export default async function WeatherPage() {
  const forecast = await db.weatherForecast.getForecast()

  // Extended forecast with more details (mock data)
  const extendedForecast = [
    {
      day: "Today",
      temp: 28,
      condition: "Sunny",
      precipitation: "0%",
      humidity: "45%",
      wind: "5 km/h",
      uvIndex: "High",
      sunrise: "6:15 AM",
      sunset: "8:30 PM",
    },
    {
      day: "Tomorrow",
      temp: 26,
      condition: "Partly Cloudy",
      precipitation: "10%",
      humidity: "50%",
      wind: "8 km/h",
      uvIndex: "Medium",
      sunrise: "6:16 AM",
      sunset: "8:29 PM",
    },
    {
      day: "Wednesday",
      temp: 24,
      condition: "Cloudy",
      precipitation: "20%",
      humidity: "65%",
      wind: "12 km/h",
      uvIndex: "Low",
      sunrise: "6:17 AM",
      sunset: "8:28 PM",
    },
    {
      day: "Thursday",
      temp: 22,
      condition: "Light Rain",
      precipitation: "60%",
      humidity: "75%",
      wind: "15 km/h",
      uvIndex: "Low",
      sunrise: "6:18 AM",
      sunset: "8:27 PM",
    },
    {
      day: "Friday",
      temp: 23,
      condition: "Showers",
      precipitation: "70%",
      humidity: "80%",
      wind: "10 km/h",
      uvIndex: "Low",
      sunrise: "6:19 AM",
      sunset: "8:26 PM",
    },
    {
      day: "Saturday",
      temp: 25,
      condition: "Partly Cloudy",
      precipitation: "30%",
      humidity: "60%",
      wind: "7 km/h",
      uvIndex: "Medium",
      sunrise: "6:20 AM",
      sunset: "8:25 PM",
    },
    {
      day: "Sunday",
      temp: 27,
      condition: "Sunny",
      precipitation: "5%",
      humidity: "50%",
      wind: "6 km/h",
      uvIndex: "High",
      sunrise: "6:21 AM",
      sunset: "8:24 PM",
    },
  ]

  // Historical weather data (mock data)
  const historicalWeather = [
    { date: "Last Week", avgTemp: 26, totalRain: 5, avgHumidity: 55 },
    { date: "2 Weeks Ago", avgTemp: 25, totalRain: 15, avgHumidity: 65 },
    { date: "3 Weeks Ago", avgTemp: 24, totalRain: 25, avgHumidity: 70 },
    { date: "4 Weeks Ago", avgTemp: 23, totalRain: 30, avgHumidity: 75 },
  ]

  // Weather impact data (mock data)
  const weatherImpactData = [
    { date: "Mon", scheduledWater: 100, adjustedWater: 100, rainfall: 0 },
    { date: "Tue", scheduledWater: 100, adjustedWater: 80, rainfall: 0 },
    { date: "Wed", scheduledWater: 100, adjustedWater: 100, rainfall: 0 },
    { date: "Thu", scheduledWater: 100, adjustedWater: 0, rainfall: 25 },
    { date: "Fri", scheduledWater: 100, adjustedWater: 0, rainfall: 30 },
    { date: "Sat", scheduledWater: 100, adjustedWater: 70, rainfall: 0 },
    { date: "Sun", scheduledWater: 100, adjustedWater: 100, rainfall: 0 },
  ]

  // Helper function to get weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return Sun
      case "partly cloudy":
        return CloudSun
      case "cloudy":
        return Cloud
      case "light rain":
        return CloudDrizzle
      case "showers":
      case "rain":
        return CloudRain
      default:
        return Cloud
    }
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
        <h1 className="text-3xl font-bold">Weather Forecast</h1>
        <p className="text-muted-foreground">Weather data and irrigation impact</p>
      </div>

      <Tabs defaultValue="forecast">
        <TabsList className="mb-4">
          <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
          <TabsTrigger value="impact">Irrigation Impact</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
          <TabsTrigger value="settings">Weather Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            {extendedForecast.map((day, index) => {
              const WeatherIcon = getWeatherIcon(day.condition)
              return (
                <Card key={index} className={index === 0 ? "md:col-span-2 bg-muted/30" : ""}>
                  <CardHeader className={index === 0 ? "pb-2" : "pb-2 px-3"}>
                    <CardTitle className={index === 0 ? "text-xl" : "text-base"}>{day.day}</CardTitle>
                    <CardDescription>{day.condition}</CardDescription>
                  </CardHeader>
                  <CardContent className={index === 0 ? "space-y-4" : "px-3 py-2"}>
                    <div className="flex items-center justify-between">
                      <WeatherIcon className={index === 0 ? "h-16 w-16" : "h-10 w-10"} />
                      <div className="text-right">
                        <div className={index === 0 ? "text-4xl font-bold" : "text-2xl font-bold"}>{day.temp}°C</div>
                        <div className="text-sm text-muted-foreground">Rain: {day.precipitation}</div>
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Humidity</p>
                          <p>{day.humidity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Wind</p>
                          <p>{day.wind}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">UV Index</p>
                          <p>{day.uvIndex}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sunrise/Sunset</p>
                          <p>
                            {day.sunrise}/{day.sunset}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  {index === 0 && (
                    <CardFooter>
                      <div className="text-sm text-muted-foreground">
                        <Droplets className="inline-block h-4 w-4 mr-1" />
                        Irrigation adjusted based on forecast
                      </div>
                    </CardFooter>
                  )}
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hourly Forecast</CardTitle>
              <CardDescription>Next 24 hours temperature and precipitation</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Hourly forecast chart would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather Impact on Irrigation</CardTitle>
              <CardDescription>How weather affects your watering schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <WeatherImpactChart data={weatherImpactData} />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                The chart shows how scheduled watering is adjusted based on weather conditions and rainfall
              </p>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Adjustments</CardTitle>
                <CardDescription>Weather-based modifications to irrigation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Today's Adjustment</p>
                    <p className="text-sm text-muted-foreground">Based on sunny conditions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">No Change</p>
                    <p className="text-sm text-muted-foreground">100% of normal</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tomorrow's Adjustment</p>
                    <p className="text-sm text-muted-foreground">Based on partly cloudy conditions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Slight Reduction</p>
                    <p className="text-sm text-muted-foreground">80% of normal</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Thursday's Adjustment</p>
                    <p className="text-sm text-muted-foreground">Based on light rain forecast</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Skipped</p>
                    <p className="text-sm text-muted-foreground">0% of normal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Savings</CardTitle>
                <CardDescription>Estimated water conservation from weather adjustments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">This Week</p>
                    <p className="text-sm text-muted-foreground">Based on forecast</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">150 L</p>
                    <p className="text-sm text-muted-foreground">35% savings</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">This Month</p>
                    <p className="text-sm text-muted-foreground">Running total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">450 L</p>
                    <p className="text-sm text-muted-foreground">28% savings</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">This Year</p>
                    <p className="text-sm text-muted-foreground">Running total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">2,450 L</p>
                    <p className="text-sm text-muted-foreground">32% savings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Weather Data</CardTitle>
              <CardDescription>Past weather conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Period</th>
                      <th className="text-left py-3 px-4">Avg. Temperature</th>
                      <th className="text-left py-3 px-4">Total Rainfall</th>
                      <th className="text-left py-3 px-4">Avg. Humidity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalWeather.map((period, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{period.date}</td>
                        <td className="py-3 px-4">{period.avgTemp}°C</td>
                        <td className="py-3 px-4">{period.totalRain} mm</td>
                        <td className="py-3 px-4">{period.avgHumidity}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Historical Data
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Rainfall</CardTitle>
              <CardDescription>Rainfall compared to historical average</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Monthly rainfall chart would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather Data Settings</CardTitle>
              <CardDescription>Configure weather data sources and adjustments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="font-medium">Weather Data Source</label>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="weather-source-1" name="weather-source" defaultChecked />
                  <label htmlFor="weather-source-1">System Default (OpenWeatherMap)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="weather-source-2" name="weather-source" />
                  <label htmlFor="weather-source-2">Weather Underground</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="weather-source-3" name="weather-source" />
                  <label htmlFor="weather-source-3">AccuWeather</label>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="font-medium">Location Settings</label>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="location-auto" name="location-setting" defaultChecked />
                  <label htmlFor="location-auto">Use system location</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="location-manual" name="location-setting" />
                  <label htmlFor="location-manual">Set location manually</label>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="font-medium">Weather-based Adjustments</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="adjust-temp" defaultChecked />
                  <label htmlFor="adjust-temp">Adjust for temperature</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="adjust-rain" defaultChecked />
                  <label htmlFor="adjust-rain">Adjust for rainfall</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="adjust-humidity" defaultChecked />
                  <label htmlFor="adjust-humidity">Adjust for humidity</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="adjust-wind" />
                  <label htmlFor="adjust-wind">Adjust for wind speed</label>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="font-medium">Rainfall Threshold</label>
                <div className="flex items-center space-x-2">
                  <input type="range" min="1" max="25" defaultValue="5" className="w-full" />
                  <span>5mm</span>
                </div>
                <p className="text-xs text-muted-foreground">Skip irrigation when rainfall exceeds this amount</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Weather Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
