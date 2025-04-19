"use client"

import { useState } from "react"
import { StarRating } from "./star-rating"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Trash2 } from "lucide-react"
import type { Mission } from "@/app/actions"
import { deleteMission } from "@/app/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MissionCardProps {
  mission: Mission
  onToggleCompletion: (id: number) => void
  onDelete: (id: number) => void
  isParentMode: boolean
}

export function MissionCard({ mission, onToggleCompletion, onDelete, isParentMode }: MissionCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteMission(mission.id)
    onDelete(mission.id)
    setIsDeleting(false)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Card className="overflow-hidden border-gray-800 bg-gray-900/50 transition-all hover:bg-gray-900/80">
        <div className="flex">
          <div className="flex-grow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{mission.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {isParentMode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-red-500 hover:bg-red-900/20 hover:text-red-400"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mission</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete the mission "{mission.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
