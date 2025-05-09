"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

// Create a SQL client with the Neon connection string
const sql = neon(process.env.DATABASE_URL!)

// Type for mission data
export type Mission = {
  id: number
  title: string
  description: string
  stars: number
  completed: boolean
  created_at?: string
}

// Get all missions
export async function getMissions(): Promise<Mission[]> {
  try {
    const missions = await sql<Mission[]>`
      SELECT * FROM missions ORDER BY stars ASC, title ASC
    `
    return missions
  } catch (error) {
    console.error("Failed to fetch missions:", error)
    return []
  }
}

// Add a new mission
export async function addMission(formData: FormData): Promise<{ success: boolean; message: string }> {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const stars = Number.parseInt(formData.get("stars") as string)

  if (!title || !description || isNaN(stars)) {
    return { success: false, message: "Invalid mission data" }
  }

  try {
    await sql`
      INSERT INTO missions (title, description, stars, completed)
      VALUES (${title}, ${description}, ${stars}, false)
    `
    revalidatePath("/")
    return { success: true, message: "Mission added successfully!" }
  } catch (error) {
    console.error("Failed to add mission:", error)
    return { success: false, message: "Failed to add mission" }
  }
}

// Toggle mission completion status
export async function toggleMissionCompletion(id: number): Promise<{ success: boolean }> {
  try {
    await sql`
      UPDATE missions
      SET completed = NOT completed
      WHERE id = ${id}
    `
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to toggle mission completion:", error)
    return { success: false }
  }
}

// Delete a mission
export async function deleteMission(id: number): Promise<{ success: boolean; message: string }> {
  try {
    await sql`
      DELETE FROM missions
      WHERE id = ${id}
    `
    revalidatePath("/")
    return { success: true, message: "Mission deleted successfully" }
  } catch (error) {
    console.error("Failed to delete mission:", error)
    return { success: false, message: "Failed to delete mission" }
  }
}

// Get mission completion stats
export async function getMissionStats(): Promise<{ completed: number; total: number }> {
  try {
    const result = await sql`
      SELECT 
        SUM(stars) FILTER (WHERE completed = true) as completed
      FROM missions
    `

    return {
      completed: Number.parseInt(result[0].completed as string) * 10 || 0,
      total: 100,
    }
  } catch (error) {
    console.error("Failed to get mission stats:", error)
    return { completed: 0, total: 0 }
  }
}

// Get milestone settings
export async function getMilestoneSettings(): Promise<{ totalGoal: number; currentValue: number }> {
  try {
    const result = await sql`
      SELECT total_goal, current_value FROM milestone_settings LIMIT 1
    `

    if (result.length === 0) {
      // If no settings exist, return defaults
      return { totalGoal: 100, currentValue: 0 }
    }

    return {
      totalGoal: Number(result[0].total_goal),
      currentValue: Number(result[0].current_value),
    }
  } catch (error) {
    console.error("Failed to get milestone settings:", error)
    return { totalGoal: 100, currentValue: 0 }
  }
}

// Update milestone goal
export async function updateMilestoneGoal(goal: number): Promise<{ success: boolean; message: string }> {
  if (isNaN(goal) || goal <= 0) {
    return { success: false, message: "Invalid goal value" }
  }

  try {
    await sql`
      UPDATE milestone_settings
      SET total_goal = ${goal}
      WHERE id = (SELECT id FROM milestone_settings LIMIT 1)
    `
    revalidatePath("/")
    return { success: true, message: "Milestone goal updated successfully" }
  } catch (error) {
    console.error("Failed to update milestone goal:", error)
    return { success: false, message: "Failed to update milestone goal" }
  }
}

// Update milestone current value
export async function updateMilestoneValue(value: number): Promise<{ success: boolean; message: string }> {
  if (isNaN(value) || value < 0) {
    return { success: false, message: "Invalid value" }
  }

  try {
    await sql`
      UPDATE milestone_settings
      SET current_value = ${value}
      WHERE id = (SELECT id FROM milestone_settings LIMIT 1)
    `
    revalidatePath("/")
    return { success: true, message: "Milestone value updated successfully" }
  } catch (error) {
    console.error("Failed to update milestone value:", error)
    return { success: false, message: "Failed to update milestone value" }
  }
}

// Increase milestone current value
export async function increaseMilestoneValue(value: number): Promise<{ success: boolean; message: string }> {
  if (isNaN(value)) {
    return { success: false, message: "Invalid value" }
  }

  try {
    await sql`
      UPDATE milestone_settings
      SET current_value = current_value + (${value})
      WHERE id = (SELECT id FROM milestone_settings LIMIT 1)
    `
    revalidatePath("/")
    return { success: true, message: "Milestone value updated successfully" }
  } catch (error) {
    console.error("Failed to update milestone value:", error)
    return { success: false, message: "Failed to update milestone value" }
  }
}
