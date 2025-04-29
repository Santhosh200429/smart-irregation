import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { initializeSystem } from "@/lib/data-service"

const inter = Inter({ subsets: ["latin"] })

// Initialize the system on server start
// Note: In a real app, this would be done in a separate process
if (typeof window === "undefined") {
  try {
    initializeSystem()
  } catch (error) {
    console.error("Failed to initialize system:", error)
  }
}

export const metadata = {
  title: "Smart Irrigation System",
  description: "Monitor and control your irrigation system efficiently",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
