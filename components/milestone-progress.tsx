"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateMilestoneGoal, updateMilestoneValue } from "@/app/actions"

interface MilestoneProgressProps {
  value: number
  maxValue: number
  isParentMode: boolean
}

export function MilestoneProgress({ value, maxValue, isParentMode }: MilestoneProgressProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newGoal, setNewGoal] = useState(maxValue.toString())
  const [newValue, setNewValue] = useState(value.toString())
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const percentage = Math.min(Math.round((value / maxValue) * 100), 100)

  const handleSave = async () => {
    setIsUpdating(true)
    setMessage(null)

    try {
      // Update goal if changed
      if (Number.parseInt(newGoal) !== maxValue) {
        const goalResult = await updateMilestoneGoal(Number.parseInt(newGoal))
        if (!goalResult.success) {
          setMessage({ type: "error", text: goalResult.message })
          setIsUpdating(false)
          return
        }
      }

      // Update value if changed
      if (Number.parseInt(newValue) !== value) {
        const valueResult = await updateMilestoneValue(Number.parseInt(newValue))
        if (!valueResult.success) {
          setMessage({ type: "error", text: valueResult.message })
          setIsUpdating(false)
          return
        }
      }

      setMessage({ type: "success", text: "Milestone updated successfully" })
      setIsEditing(false)

      // Message will disappear after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update milestone" })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="mb-6 mt-2">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-400">Milestone Progress</span>
        <div className="flex items-center gap-2">
          {isParentMode && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-gray-400 hover:text-yellow-400"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
          <span className="text-sm font-medium text-yellow-400">
            ({value}/{maxValue}) {percentage}% Complete
          </span>
        </div>
      </div>

      {isEditing && isParentMode ? (
        <div className="mb-4 bg-gray-800 p-3 rounded-lg border border-gray-700">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="milestone-goal" className="block text-xs text-gray-400 mb-1">
                  Total Goal
                </label>
                <Input
                  id="milestone-goal"
                  type="number"
                  min="1"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="bg-gray-700 border-gray-600 h-8"
                />
              </div>
              <div>
                <label htmlFor="milestone-value" className="block text-xs text-gray-400 mb-1">
                  Current Value
                </label>
                <Input
                  id="milestone-value"
                  type="number"
                  min="0"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="bg-gray-700 border-gray-600 h-8"
                />
              </div>
            </div>

            {message && (
              <div className={`text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {message.text}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => {
                  setIsEditing(false)
                  setNewGoal(maxValue.toString())
                  setNewValue(value.toString())
                  setMessage(null)
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={handleSave}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="h-4 bg-gray-800 rounded-full overflow-visible relative">
        {/* Progress bar */}
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Trophy icon that moves with progress */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          initial={{ left: 0 }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            marginLeft: percentage === 100 ? "-24px" : "-12px",
            zIndex: 10, // Ensure trophy is in front of the progress bar
          }}
        >
          <Trophy
            className={`h-6 w-6 ${
              percentage === 100
                ? "text-yellow-300 fill-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.7)]"
                : "text-gray-300 fill-gray-300"
            }`}
          />
        </motion.div>
      </div>

      {percentage === 100 && (
        <motion.div
          className="mt-2 text-center text-yellow-300 font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          🏆 Milestone achieved! Congratulations! 🏆
        </motion.div>
      )}
    </div>
  )
}
