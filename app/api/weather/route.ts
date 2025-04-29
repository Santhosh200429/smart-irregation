import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// API route to get weather forecast
export async function GET() {
  try {
    const forecast = await db.weatherForecast.getForecast()
    return NextResponse.json({ success: true, data: forecast })
  } catch (error) {
    console.error("Error fetching weather forecast:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch weather forecast" }, { status: 500 })
  }
}
