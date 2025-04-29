"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { ScheduleFormData, SmartRulesData, ZoneData, ScheduleData } from "@/lib/types"

// Zone Actions
export async function toggleZoneAction(zoneId: number): Promise<ZoneData> {
  try {
    // Get current zone state
    const zone = await db.zones.findById(zoneId)

    if (!zone) {
      throw new Error(`Zone with ID ${zoneId} not found`)
    }

    // Toggle the active state
    const updatedZone = await db.zones.update(zoneId, {
      active: !zone.active,
    })

    // If we're activating a zone, log the watering event
    if (updatedZone.active) {
      await db.wateringEvents.create({
        zoneId,
        startTime: new Date(),
        isManual: false,
        isScheduled: true,
      })
    }

    // If we're deactivating a zone, update the end time of any active watering events
    if (!updatedZone.active) {
      await db.wateringEvents.updateActiveEvent(zoneId, {
        endTime: new Date(),
      })
    }

    revalidatePath("/")
    revalidatePath("/zones")

    return updatedZone
  } catch (error) {
    console.error("Error toggling zone:", error)
    throw new Error("Failed to toggle zone")
  }
}

export async function waterZoneNowAction(zoneId: number): Promise<void> {
  try {
    // Activate the zone
    await db.zones.update(zoneId, {
      active: true,
    })

    // Log the manual watering event
    await db.wateringEvents.create({
      zoneId,
      startTime: new Date(),
      isManual: true,
      isScheduled: false,
    })

    // Schedule the zone to turn off after 10 minutes
    setTimeout(
      async () => {
        try {
          await db.zones.update(zoneId, {
            active: false,
          })

          await db.wateringEvents.updateActiveEvent(zoneId, {
            endTime: new Date(),
          })

          revalidatePath("/")
          revalidatePath("/zones")
        } catch (error) {
          console.error("Error turning off zone after manual watering:", error)
        }
      },
      10 * 60 * 1000,
    ) // 10 minutes

    revalidatePath("/")
    revalidatePath("/zones")
  } catch (error) {
    console.error("Error watering zone now:", error)
    throw new Error("Failed to start watering")
  }
}

// Schedule Actions
export async function createScheduleAction(data: ScheduleFormData): Promise<ScheduleData> {
  try {
    const newSchedule = await db.schedules.create({
      name: data.name,
      time: data.time,
      days: data.days,
      zones: data.zones,
      duration: data.duration,
      active: true,
    })

    revalidatePath("/")
    revalidatePath("/schedule")

    return newSchedule
  } catch (error) {
    console.error("Error creating schedule:", error)
    throw new Error("Failed to create schedule")
  }
}

export async function toggleScheduleAction(scheduleId: number): Promise<ScheduleData> {
  try {
    const schedule = await db.schedules.findById(scheduleId)

    if (!schedule) {
      throw new Error(`Schedule with ID ${scheduleId} not found`)
    }

    const updatedSchedule = await db.schedules.update(scheduleId, {
      active: !schedule.active,
    })

    revalidatePath("/")
    revalidatePath("/schedule")

    return updatedSchedule
  } catch (error) {
    console.error("Error toggling schedule:", error)
    throw new Error("Failed to toggle schedule")
  }
}

export async function deleteScheduleAction(scheduleId: number): Promise<void> {
  try {
    await db.schedules.delete(scheduleId)

    revalidatePath("/")
    revalidatePath("/schedule")
  } catch (error) {
    console.error("Error deleting schedule:", error)
    throw new Error("Failed to delete schedule")
  }
}

// Smart Rules Actions
export async function updateSmartRulesAction(data: SmartRulesData): Promise<void> {
  try {
    await db.settings.updateSmartRules(data)

    revalidatePath("/")
    revalidatePath("/schedule")
    revalidatePath("/settings")
  } catch (error) {
    console.error("Error updating smart rules:", error)
    throw new Error("Failed to update smart rules")
  }
}
