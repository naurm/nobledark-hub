import { Pool } from "pg"

function getPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable not set")
  }
  return new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
}

export async function query(text: string, params?: any[]) {
  const pool = getPool()
  try {
    const result = await pool.query(text, params)
    return result
  } finally {
    await pool.end()
  }
}