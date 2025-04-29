"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ScheduleData } from "@/lib/types"

interface ScheduleCalendarProps {
  schedules: ScheduleData[]
}

export function ScheduleCalendar({ schedules }: ScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Calendar navigation
  const nextMonth = () => {
    const next = new Date(currentMonth)
    next.setMonth(next.getMonth() + 1)
    setCurrentMonth(next)
  }

  const prevMonth = () => {
    const prev = new Date(currentMonth)
    prev.setMonth(prev.getMonth() - 1)
    setCurrentMonth(prev)
  }

  // Get days in month
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  // Generate calendar days
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border border-muted p-1"></div>)
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]

    // Find schedules for this day
    const daySchedules = schedules.filter((s) => s.active && s.days.includes(dayName))

    days.push(
      <div key={day} className="h-24 border border-muted p-1 overflow-hidden">
        <div className="text-sm font-medium mb-1">{day}</div>
        {daySchedules.map((schedule, idx) => (
          <div
            key={idx}
            className="text-xs mb-1 truncate rounded bg-primary/10 px-1 py-0.5 text-primary"
            title={`${schedule.name} - ${schedule.time} - Zones: ${schedule.zones.join(", ")}`}
          >
            <Droplets className="inline-block h-3 w-3 mr-0.5" />
            {schedule.time} - {schedule.name}
          </div>
        ))}
      </div>,
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium py-2 border-b">
            {day}
          </div>
        ))}
        {days}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Click on a day to add or edit schedules for that specific date.</p>
      </div>
    </div>
  )
}
