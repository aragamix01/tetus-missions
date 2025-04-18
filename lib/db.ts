import { neon } from "@neondatabase/serverless"

// Create a SQL client with the Neon connection string
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to initialize the database
export async function initializeDatabase() {
  try {
    // Create missions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS missions (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        stars INTEGER NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    console.log("Database initialized successfully")
    return { success: true }
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return { success: false, error }
  }
}
