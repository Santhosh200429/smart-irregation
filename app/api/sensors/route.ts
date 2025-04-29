import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// API route to get current sensor data for all zones
export async function GET() {
  try {
    const zones = await db.zones.findAll()

    // Extract just the sensor data we need
    const sensorData = zones.map((zone) => ({
      zoneId: zone.id,
      zoneName: zone.name,
      moisture: zone.moisture,
      active: zone.active,
      timestamp: new Date().toISOString(),
    }))

    return NextResponse.json({ success: true, data: sensorData })
  } catch (error) {
    console.error("Error fetching sensor data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch sensor data" }, { status: 500 })
  }
}

// API route to update sensor data (for simulation or external sensors)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request
    if (!body.zoneId || body.moisture === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Update zone moisture
    const updatedZone = await db.zones.update(body.zoneId, {
      moisture: body.moisture,
    })

    return NextResponse.json({ success: true, data: updatedZone })
  } catch (error) {
    console.error("Error updating sensor data:", error)
    return NextResponse.json({ success: false, error: "Failed to update sensor data" }, { status: 500 })
  }
}
