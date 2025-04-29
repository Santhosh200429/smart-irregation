"use client"

import { Cloud, CloudDrizzle, CloudRain, Sun, CloudSun } from "lucide-react"
import type { WeatherForecastData } from "@/lib/types"

interface WeatherForecastProps {
  forecast: WeatherForecastData[]
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  // Map weather conditions to icons
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
    <div className="space-y-4">
      {forecast.map((day, index) => {
        const WeatherIcon = getWeatherIcon(day.condition)
        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <WeatherIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{day.day}</p>
                <p className="text-sm text-muted-foreground">{day.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{day.temp}°C</p>
              <p className="text-sm text-muted-foreground">Rain: {day.precipitation}</p>
            </div>
          </div>
        )
      })}
      <div className="pt-2 text-xs text-muted-foreground">
        <p>Weather data automatically adjusts irrigation schedules</p>
      </div>
    </div>
  )
}
