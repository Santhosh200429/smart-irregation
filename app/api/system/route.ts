import { NextResponse } from "next/server"
import { getDashboardData } from "@/lib/data-service"

// API route to get complete system status
export async function GET() {
  try {
    const dashboardData = await getDashboardData()

    return NextResponse.json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    console.error("Error fetching system status:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch system status" }, { status: 500 })
  }
}
