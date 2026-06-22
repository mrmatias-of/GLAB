import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Query functions for courses
export async function getCursos() {
  const result = await pool.query(
    'SELECT * FROM cursos ORDER BY trilha_id, posicao'
  )
  return result.rows
}

export async function getTrilhas() {
  const result = await pool.query(
    'SELECT * FROM trilhas ORDER BY posicao'
  )
  return result.rows
}

export async function getCursosByTrilha(trilhaId: number) {
  const result = await pool.query(
    'SELECT * FROM cursos WHERE trilha_id = $1 ORDER BY posicao',
    [trilhaId]
  )
  return result.rows
}
