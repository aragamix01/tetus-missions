"use client"

import { useEffect, useState } from "react"
import { MissionCard } from "./mission-card"
import { ProgressBar } from "./progress-bar"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, X } from "lucide-react"
import Link from "next/link"
import {
  type Mission,
  getMissions,
  toggleMissionCompletion,
  getMissionStats,
  getMilestoneSettings,
  increaseMilestoneValue,
} from "@/app/actions"
import { PinDialog } from "./pin-dialog"
import { MilestoneProgress } from "./milestone-progress"

// Static PIN for parent access
const PARENT_PIN = "9160"
// Key for localStorage
const PARENT_MODE_KEY = "kids_mission_parent_mode"

const TOTAL_POINT = 100

export function MissionList() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [stats, setStats] = useState({ completed: 0, total: TOTAL_POINT })
  const [milestoneStats, setMilestoneStats] = useState({ currentValue: 0, totalGoal: 100 })
  const [isLoading, setIsLoading] = useState(true)
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false)
  const [isParentMode, setIsParentMode] = useState(false)
  const [isExit, setIsExitMode] = useState(false)

  // Load missions from database and check parent mode on component mount
  useEffect(() => {
    async function loadMissions() {
      try {
        const fetchedMissions = await getMissions()
        setMissions(fetchedMissions)

        const missionStats = await getMissionStats()
        setStats(missionStats)

        // Fetch milestone settings
        const milestoneData = await getMilestoneSettings()
        setMilestoneStats(milestoneData)

        // Check if parent mode is active in localStorage
        const parentMode = localStorage.getItem(PARENT_MODE_KEY) === "true"
        setIsParentMode(parentMode)

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading missions:", error)
        setIsLoading(false)
      }
    }

    loadMissions()
  }, [])

  // Update localStorage when parent mode changes
  useEffect(() => {
    if (isParentMode) {
      localStorage.setItem(PARENT_MODE_KEY, "true")
    } else if (!isParentMode && isExit) {
      localStorage.setItem(PARENT_MODE_KEY, "false")
      setIsExitMode(false)
    }
  }, [isParentMode])

  const handleToggleCompletion = async (id: number) => {
    // Optimistically update UI
    setMissions(
      missions.map((mission) => (mission.id === id ? { ...mission, completed: !mission.completed } : mission)),
    )

    // Update stats optimistically
    let point = 0
    const missionToToggle = missions.find((m) => m.id === id)
    if (missionToToggle) {
      point = missionToToggle.stars * 10
      if (missionToToggle.completed) {
        setStats({completed: stats.completed - point, total: TOTAL_POINT })
      } else {
        setStats({completed: stats.completed + point, total: TOTAL_POINT })
        setMilestoneStats({...milestoneStats, currentValue: milestoneStats.currentValue + point})
      }
    }

    // Send to server
    await toggleMissionCompletion(id)
    console.log(point)
    await increaseMilestoneValue(point)
  }

  const handleDeleteMission = (id: number) => {
    // Find the mission to be deleted
    const missionToDelete = missions.find((m) => m.id === id)

    // Update missions list optimistically
    setMissions(missions.filter((mission) => mission.id !== id))

    // Update stats if the deleted mission was completed
    if (missionToDelete && missionToDelete.completed) {
      setStats({
        completed: stats.completed - 1,
        total: stats.total - 1,
      })
    } else {
      setStats({
        ...stats,
        total: stats.total - 1,
      })
    }
  }

  const handleManageClick = () => {
    setIsPinDialogOpen(true)
  }

  const handlePinSuccess = () => {
    setIsParentMode(true)
  }

  const handleExitParentMode = () => {
    setIsParentMode(false)
    setIsExitMode(true)
  }

  const handleMilestoneUpdate = (newValue: number, newMaxValue: number) => {
    setMilestoneStats({
      currentValue: newValue,
      totalGoal: newMaxValue,
    })
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
      {/* PIN Dialog */}
      <PinDialog
        isOpen={isPinDialogOpen}
        onClose={() => setIsPinDialogOpen(false)}
        onSuccess={handlePinSuccess}
        correctPin={PARENT_PIN}
      />

      {/* Progress Bar */}
      <ProgressBar value={stats.completed} maxValue={stats.total} />

      {/* Milestone Progress Bar */}
      <MilestoneProgress
        value={milestoneStats.currentValue}
        maxValue={milestoneStats.totalGoal}
        isParentMode={isParentMode}
        onUpdate={handleMilestoneUpdate}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Missions</h2>
        <div className="flex gap-2">
          {isParentMode ? (
            <>
              <Link href="/add-mission">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Mission
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={handleExitParentMode}
              >
                <X className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={handleManageClick}
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage
            </Button>
          )}
        </div>
      </div>

      {missions.length === 0 ? (
        <div className="text-center py-10 bg-gray-900/50 rounded-lg border border-gray-800">
          <p className="text-gray-400">
            No missions yet. {isParentMode ? "Add your first mission!" : "Ask a parent to add missions."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onToggleCompletion={handleToggleCompletion}
              onDelete={handleDeleteMission}
              isParentMode={isParentMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
