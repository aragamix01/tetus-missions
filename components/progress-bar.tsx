"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"

interface ProgressBarProps {
  value: number
  maxValue: number
}

export function ProgressBar({ value, maxValue }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / maxValue) * 100), 100)

  return (
    <div className="mb-6 mt-2">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-400">Mission Progress</span>
        <span className="text-sm font-medium text-purple-400">
          ({percentage}/100) {percentage}% Complete
        </span>
      </div>
      <div className="h-4 bg-gray-800 rounded-full overflow-visible relative">
        {/* Progress bar */}
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
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
          🎉 All missions completed! You're amazing! 🎉
        </motion.div>
      )}
    </div>
  )
}
