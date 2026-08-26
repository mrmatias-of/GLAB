import { createPool, type Pool } from 'mysql2/promise'

const connectionString = process.env.DATABASE_URL

const databaseConfigError = new Error(
  'DATABASE_URL precisa apontar para o banco MySQL da G-LAB.',
)

// Do not fail Next.js page-data collection when the deployment environment is
// missing its secret. The first real database operation still fails loudly.
// This keeps a misconfigured preview diagnosable without taking down the
// entire build pipeline.
const isMySql = connectionString?.startsWith('mysql')

function createUnconfiguredPool(): Pool {
  const throwConfigError = async () => {
    throw databaseConfigError
  }
  return {
    query: throwConfigError,
    execute: throwConfigError,
  } as unknown as Pool
}

/** Single server-side pool shared by Better Auth and the learning platform. */
export const pool: Pool = isMySql
  ? createPool({
      uri: connectionString,
      connectionLimit: 5,
      enableKeepAlive: true,
      timezone: 'Z',
    })
  : createUnconfiguredPool()
