import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2/promise'

const connectionString = process.env.DATABASE_URL

if (!connectionString?.startsWith('mysql')) {
  throw new Error('DATABASE_URL precisa apontar para o banco MySQL da G-LAB.')
}

/** Single server-side pool shared by Better Auth and the learning platform. */
export const pool = createPool({
  uri: connectionString,
  connectionLimit: 5,
  enableKeepAlive: true,
  timezone: 'Z',
})

// The legacy technical-assistance repositories are not part of the new
// learning platform. Keep this untyped client only while that old area is
// being retired; new code should use explicit MySQL queries/repositories.
export const db = drizzle(pool)
