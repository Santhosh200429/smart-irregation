// System Overview Types
export interface SystemOverviewData {
  activeZones: number
  totalZones: number
  waterUsage: number
  waterUsageChange: number
  avgMoisture: number
  optimalRange: string
  nextScheduledTime: string
  nextScheduledDay: string
  nextScheduledZones: string
}

// Zone Types
export interface ZoneData {
  id: number
  name: string
  active: boolean
  moisture: number
  lastWatered: string
  nextScheduled: string
}

// Schedule Types
export interface ScheduleData {
  id: number
  name: string
  time: string
  days: string[]
  zones: number[]
  duration: number
  active: boolean
}

export interface ScheduleFormData {
  name: string
  time: string
  duration: number
  days: string[]
  zones: number[]
}

// Weather Types
export interface WeatherForecastData {
  day: string
  temp: number
  condition: string
  precipitation: string
}

// Moisture History Types
export interface MoistureHistoryData {
  date: string
  zone1: number
  zone2: number
  zone3: number
  zone4: number
  zone5: number
  zone6: number
}

// Smart Rules Types
export interface SmartRulesData {
  weatherAdjust: boolean
  moistureAdjust: boolean
  seasonalAdjust: boolean
}

// Dashboard Data
export interface DashboardData {
  overview: SystemOverviewData
  zones: ZoneData[]
  schedules: ScheduleData[]
  moistureHistory: MoistureHistoryData[]
  weatherForecast: WeatherForecastData[]
}
