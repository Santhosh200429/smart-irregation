import { db } from "@/lib/db"
import type { DashboardData } from "@/lib/types"

// This service layer handles data fetching and aggregation
export async function getDashboardData(): Promise<DashboardData> {
  // Fetch all the data we need for the dashboard
  const [zones, schedules, moistureHistory, weatherForecast, overview] = await Promise.all([
    db.zones.findAll(),
    db.schedules.findAll(),
    db.moistureHistory.getHistory(),
    db.weatherForecast.getForecast(),
    db.dashboard.getOverview(),
  ])

  return {
    zones,
    schedules,
    moistureHistory,
    weatherForecast,
    overview,
  }
}

// Function to simulate sensor data updates
// In a real application, this would connect to actual sensors
export async function simulateSensorUpdates() {
  // Get all zones
  const zones = await db.zones.findAll()

  // Update each zone's moisture level with a small random change
  for (const zone of zones) {
    const randomChange = Math.floor(Math.random() * 5) - 2 // Random number between -2 and 2
    let newMoisture = zone.moisture + randomChange

    // Keep moisture within reasonable bounds
    newMoisture = Math.max(45, Math.min(85, newMoisture))

    // Update the zone
    await db.zones.update(zone.id, {
      moisture: newMoisture,
    })
  }
}

// Function to check and run scheduled irrigation
export async function checkAndRunSchedules() {
  const now = new Date()
  const currentDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()]
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // Get all active schedules
  const schedules = await db.schedules.findAll()
  const activeSchedules = schedules.filter((s) => s.active)

  for (const schedule of activeSchedules) {
    // Parse schedule time
    const [hours, minutes] = schedule.time.split(":").map(Number)
    const isPM = schedule.time.includes("PM")
    const scheduleHour = isPM ? hours + 12 : hours

    // Check if this schedule should run now
    if (schedule.days.includes(currentDay) && scheduleHour === currentHour && minutes === currentMinute) {
      // Run this schedule
      for (const zoneId of schedule.zones) {
        // Activate the zone
        await db.zones.update(zoneId, {
          active: true,
        })

        // Log the scheduled watering event
        await db.wateringEvents.create({
          zoneId,
          startTime: new Date(),
          isManual: false,
          isScheduled: true,
          scheduleId: schedule.id,
        })

        // Schedule the zone to turn off after the specified duration
        setTimeout(
          async () => {
            try {
              await db.zones.update(zoneId, {
                active: false,
              })

              await db.wateringEvents.updateActiveEvent(zoneId, {
                endTime: new Date(),
              })
            } catch (error) {
              console.error(`Error turning off zone ${zoneId} after scheduled watering:`, error)
            }
          },
          schedule.duration * 60 * 1000,
        )
      }
    }
  }
}

// Initialize the system
export async function initializeSystem() {
  console.log("Initializing smart irrigation system...")

  // Set up interval to simulate sensor updates (every 30 seconds)
  setInterval(simulateSensorUpdates, 30 * 1000)

  // Set up interval to check schedules (every minute)
  setInterval(checkAndRunSchedules, 60 * 1000)

  // Run initial check
  await checkAndRunSchedules()

  console.log("Smart irrigation system initialized successfully!")
}
