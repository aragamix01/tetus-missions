"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { StarSelector } from "@/components/star-selector"
import { addMission } from "@/app/actions"

// Key for localStorage
const PARENT_MODE_KEY = "kids_mission_parent_mode"

export default function AddMissionPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [stars, setStars] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isParentMode, setIsParentMode] = useState(false)

  // Check if parent mode is active on component mount
  useEffect(() => {
    const parentMode = localStorage.getItem(PARENT_MODE_KEY) === "true"
    setIsParentMode(parentMode)

    // If not in parent mode, redirect back to home
    if (!parentMode) {
      router.push("/")
    }
  }, [router])

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {}

    if (!title.trim()) {
      newErrors.title = "Mission title is required"
    }

    if (!description.trim()) {
      newErrors.description = "Mission description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setFormMessage(null)

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("stars", stars.toString())

      // Call server action to add mission
      const result = await addMission(formData)

      if (result.success) {
        setFormMessage({ type: "success", text: result.message })
        // Redirect back to home page after a short delay
        // Parent mode will be preserved because it's in localStorage
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1000)
      } else {
        setFormMessage({ type: "error", text: result.message })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error adding mission:", error)
      setFormMessage({ type: "error", text: "An unexpected error occurred" })
      setIsSubmitting(false)
    }
  }

  // If not in parent mode and still loading, show loading state
  if (!isParentMode && typeof window !== "undefined") {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Missions
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-yellow-400" />
          Create New Mission
        </h1>

        <Card className="bg-gray-900 border-gray-800 p-6">
          {formMessage && (
            <div
              className={`mb-4 p-3 rounded ${formMessage.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
            >
              {formMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Mission Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter a fun mission title"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Mission Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                placeholder="Describe what needs to be done"
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Star Reward (1-5 stars)</label>
              <StarSelector value={stars} onChange={setStars} />
              <p className="text-gray-400 text-sm mt-2">
                {stars === 1 && "Easy peasy! A quick and simple task."}
                {stars === 2 && "A bit of effort needed, but not too hard!"}
                {stars === 3 && "Medium difficulty, requires some work."}
                {stars === 4 && "Challenging task that takes real effort!"}
                {stars === 5 && "Super challenge! A major accomplishment!"}
              </p>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isSubmitting ? "Creating..." : "Create Mission"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
