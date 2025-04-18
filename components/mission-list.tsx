"use client"

import { useEffect, useState } from "react"
import { MissionCard } from "./mission-card"
import { ProgressBar } from "./progress-bar"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { type Mission, getMissions, toggleMissionCompletion, getMissionStats } from "@/app/actions"

export function MissionList() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [stats, setStats] = useState({ completed: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(true)

  // Load missions from database on component mount
  useEffect(() => {
    async function loadMissions() {
      try {
        const fetchedMissions = await getMissions()
        setMissions(fetchedMissions)

        const missionStats = await getMissionStats()
        setStats(missionStats)

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading missions:", error)
        setIsLoading(false)
      }
    }

    loadMissions()
  }, [])

  const handleToggleCompletion = async (id: number) => {
    // Optimistically update UI
    setMissions(
      missions.map((mission) => (mission.id === id ? { ...mission, completed: !mission.completed } : mission)),
    )

    // Update stats optimistically
    const missionToToggle = missions.find((m) => m.id === id)
    if (missionToToggle) {
      if (missionToToggle.completed) {
        setStats({ ...stats, completed: stats.completed - 1 })
      } else {
        setStats({ ...stats, completed: stats.completed + 1 })
      }
    }

    // Send to server
    await toggleMissionCompletion(id)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Add the ProgressBar component here */}
      <ProgressBar value={stats.completed} maxValue={stats.total} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Missions</h2>
        <Link href="/add-mission">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Mission
          </Button>
        </Link>
      </div>

      {missions.length === 0 ? (
        <div className="text-center py-10 bg-gray-900/50 rounded-lg border border-gray-800">
          <p className="text-gray-400">No missions yet. Add your first mission!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onToggleCompletion={handleToggleCompletion} />
          ))}
        </div>
      )}
    </div>
  )
}
