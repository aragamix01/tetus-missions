"use client"

import { StarRating } from "./star-rating"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle } from "lucide-react"
import type { Mission } from "@/app/actions"

interface MissionCardProps {
  mission: Mission
  onToggleCompletion: (id: number) => void
}

export function MissionCard({ mission, onToggleCompletion }: MissionCardProps) {
  return (
    <Card className="overflow-hidden border-gray-800 bg-gray-900/50 transition-all hover:bg-gray-900/80">
      <div className="flex">
        <div className="flex-grow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">{mission.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onToggleCompletion(mission.id)}
              >
                {mission.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            </div>
            <CardDescription className="text-gray-400">{mission.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-400">Reward:</span>
              <StarRating rating={mission.stars} />
            </div>
          </CardContent>
        </div>
        <div
          className={`w-2 ${
            mission.completed
              ? "bg-gradient-to-b from-green-400 to-green-600"
              : "bg-gradient-to-b from-purple-400 to-pink-500"
          }`}
        />
      </div>
    </Card>
  )
}
