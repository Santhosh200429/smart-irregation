import type {
  ZoneData,
  ScheduleData,
  WeatherForecastData,
  MoistureHistoryData,
  SmartRulesData,
  SystemOverviewData,
} from "@/lib/types"

// Mock database implementation
// In a real application, this would connect to a real database

// Mock data
const mockZones: ZoneData[] = [
  {
    id: 1,
    name: "Front Lawn",
    active: true,
    moisture: 62,
    lastWatered: "Today, 6:00 AM",
    nextScheduled: "Tomorrow, 5:30 AM",
  },
  {
    id: 2,
    name: "Back Lawn",
    active: true,
    moisture: 68,
    lastWatered: "Today, 6:15 AM",
    nextScheduled: "Tomorrow, 5:45 AM",
  },
  {
    id: 3,
    name: "Garden Beds",
    active: false,
    moisture: 71,
    lastWatered: "Yesterday, 6:00 AM",
    nextScheduled: "Tomorrow, 6:00 AM",
  },
  {
    id: 4,
    name: "Vegetable Garden",
    active: false,
    moisture: 65,
    lastWatered: "Yesterday, 6:15 AM",
    nextScheduled: "Tomorrow, 6:15 AM",
  },
  {
    id: 5,
    name: "Flower Beds",
    active: false,
    moisture: 59,
    lastWatered: "Yesterday, 6:30 AM",
    nextScheduled: "Tomorrow, 6:30 AM",
  },
  {
    id: 6,
    name: "Shrubs",
    active: false,
    moisture: 63,
    lastWatered: "Yesterday, 6:45 AM",
    nextScheduled: "Tomorrow, 6:45 AM",
  },
]

const mockSchedules: ScheduleData[] = [
  {
    id: 1,
    name: "Morning Routine",
    time: "5:30 AM",
    days: ["Mon", "Wed", "Fri"],
    zones: [1, 2, 3],
    duration: 15,
    active: true,
  },
  {
    id: 2,
    name: "Evening Garden",
    time: "6:30 PM",
    days: ["Tue", "Thu", "Sat"],
    zones: [3, 4, 5],
    duration: 20,
    active: true,
  },
  {
    id: 3,
    name: "Weekend Deep Water",
    time: "7:00 AM",
    days: ["Sun"],
    zones: [1, 2, 3, 4, 5, 6],
    duration: 30,
    active: false,
  },
]

const mockMoistureHistory: MoistureHistoryData[] = [
  { date: "Mon", zone1: 62, zone2: 68, zone3: 71, zone4: 65, zone5: 59, zone6: 63 },
  { date: "Tue", zone1: 58, zone2: 65, zone3: 69, zone4: 63, zone5: 57, zone6: 61 },
  { date: "Wed", zone1: 65, zone2: 70, zone3: 72, zone4: 67, zone5: 62, zone6: 66 },
  { date: "Thu", zone1: 70, zone2: 73, zone3: 75, zone4: 71, zone5: 67, zone6: 69 },
  { date: "Fri", zone1: 68, zone2: 71, zone3: 73, zone4: 69, zone5: 65, zone6: 67 },
  { date: "Sat", zone1: 65, zone2: 69, zone3: 71, zone4: 67, zone5: 63, zone6: 66 },
  { date: "Sun", zone1: 63, zone2: 67, zone3: 70, zone4: 65, zone5: 61, zone6: 64 },
]

const mockWeatherForecast: WeatherForecastData[] = [
  { day: "Today", temp: 28, condition: "Sunny", precipitation: "0%" },
  { day: "Tomorrow", temp: 26, condition: "Partly Cloudy", precipitation: "10%" },
  { day: "Wednesday", temp: 24, condition: "Cloudy", precipitation: "20%" },
  { day: "Thursday", temp: 22, condition: "Light Rain", precipitation: "60%" },
  { day: "Friday", temp: 23, condition: "Showers", precipitation: "70%" },
]

const mockSmartRules: SmartRulesData = {
  weatherAdjust: true,
  moistureAdjust: true,
  seasonalAdjust: true,
}

const mockWateringEvents: any[] = []

// Mock database implementation
export const db = {
  zones: {
    findAll: async (): Promise<ZoneData[]> => {
      return [...mockZones]
    },
    findById: async (id: number): Promise<ZoneData | null> => {
      const zone = mockZones.find((z) => z.id === id)
      return zone ? { ...zone } : null
    },
    update: async (id: number, data: Partial<ZoneData>): Promise<ZoneData> => {
      const index = mockZones.findIndex((z) => z.id === id)
      if (index === -1) {
        throw new Error(`Zone with ID ${id} not found`)
      }

      mockZones[index] = { ...mockZones[index], ...data }
      return { ...mockZones[index] }
    },
  },
  schedules: {
    findAll: async (): Promise<ScheduleData[]> => {
      return [...mockSchedules]
    },
    findById: async (id: number): Promise<ScheduleData | null> => {
      const schedule = mockSchedules.find((s) => s.id === id)
      return schedule ? { ...schedule } : null
    },
    create: async (data: Omit<ScheduleData, "id">): Promise<ScheduleData> => {
      const newId = Math.max(...mockSchedules.map((s) => s.id), 0) + 1
      const newSchedule: ScheduleData = {
        id: newId,
        ...data,
      }
      mockSchedules.push(newSchedule)
      return { ...newSchedule }
    },
    update: async (id: number, data: Partial<ScheduleData>): Promise<ScheduleData> => {
      const index = mockSchedules.findIndex((s) => s.id === id)
      if (index === -1) {
        throw new Error(`Schedule with ID ${id} not found`)
      }

      mockSchedules[index] = { ...mockSchedules[index], ...data }
      return { ...mockSchedules[index] }
    },
    delete: async (id: number): Promise<void> => {
      const index = mockSchedules.findIndex((s) => s.id === id)
      if (index === -1) {
        throw new Error(`Schedule with ID ${id} not found`)
      }

      mockSchedules.splice(index, 1)
    },
  },
  moistureHistory: {
    getHistory: async (): Promise<MoistureHistoryData[]> => {
      return [...mockMoistureHistory]
    },
  },
  weatherForecast: {
    getForecast: async (): Promise<WeatherForecastData[]> => {
      return [...mockWeatherForecast]
    },
  },
  settings: {
    getSmartRules: async (): Promise<SmartRulesData> => {
      return { ...mockSmartRules }
    },
    updateSmartRules: async (data: SmartRulesData): Promise<void> => {
      Object.assign(mockSmartRules, data)
    },
  },
  wateringEvents: {
    create: async (data: any): Promise<any> => {
      const newId = mockWateringEvents.length + 1
      const newEvent = { id: newId, ...data }
      mockWateringEvents.push(newEvent)
      return { ...newEvent }
    },
    updateActiveEvent: async (zoneId: number, data: any): Promise<void> => {
      const index = mockWateringEvents.findIndex((e) => e.zoneId === zoneId && !e.endTime)

      if (index !== -1) {
        mockWateringEvents[index] = { ...mockWateringEvents[index], ...data }
      }
    },
  },
  dashboard: {
    getOverview: async (): Promise<SystemOverviewData> => {
      const activeZones = mockZones.filter((z) => z.active).length

      return {
        activeZones,
        totalZones: mockZones.length,
        waterUsage: 128,
        waterUsageChange: -32,
        avgMoisture: Math.round(mockZones.reduce((sum, zone) => sum + zone.moisture, 0) / mockZones.length),
        optimalRange: "60-75%",
        nextScheduledTime: "5:30 AM",
        nextScheduledDay: "Tomorrow",
        nextScheduledZones: "Zones 3, 4, 5",
      }
    },
  },
}
