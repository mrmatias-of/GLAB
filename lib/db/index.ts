import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2/promise'

const connectionString = process.env.DATABASE_URL

const databaseConfigError = new Error(
  'DATABASE_URL precisa apontar para o banco MySQL da G-LAB.',
)

// Do not fail Next.js page-data collection when the deployment environment is
// missing its secret. The first real database operation still fails loudly.
// This keeps a misconfigured preview diagnosable without taking down the
// entire build pipeline.
const isMySql = connectionString?.startsWith('mysql')

/** Single server-side pool shared by Better Auth and the learning platform. */
export const pool = (isMySql
  ? createPool({
      uri: connectionString,
      connectionLimit: 5,
      enableKeepAlive: true,
      timezone: 'Z',
    })
  : {
      query: async () => {
        throw databaseConfigError
      },
      execute: async () => {
        throw databaseConfigError
      },
    }) as any

// The legacy technical-assistance repositories are not part of the new
// learning platform. Keep this untyped client only while that old area is
// being retired; new code should use explicit MySQL queries/repositories.
export const db = drizzle(pool)
