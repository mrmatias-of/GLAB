import pg from 'pg'
import bcrypt from 'bcryptjs'

const { Client } = pg

async function reset() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    
    const adminEmail = 'admin@glabcursos.com'
    const newPassword = 'Admin@123456'
    
    // Get user
    const user = await client.query(
      'SELECT id FROM "user" WHERE email = $1',
      [adminEmail]
    )
    
    if (!user.rows[0]) {
      console.log('✗ Admin não encontrado')
      return
    }
    
    const userId = user.rows[0].id
    console.log(`✓ Admin encontrado: ${userId}`)
    
    // Hash password
    const hash = await bcrypt.hash(newPassword, 10)
    
    // Update directly with lowercase userid column
    const result = await client.query(
      'UPDATE account SET password = $1, "updatedAt" = NOW() WHERE userid = $2',
      [hash, userId]
    )
    
    if (result.rowCount === 0) {
      console.log('✗ Nenhuma account encontrada para atualizar')
      return
    }
    
    console.log('✓ Senha resetada!')
    console.log('')
    console.log('='.repeat(50))
    console.log('Email:  ' + adminEmail)
    console.log('Senha:  ' + newPassword)
    console.log('='.repeat(50))
    
  } catch (e) {
    console.error('✗ Erro:', e.message)
  } finally {
    await client.end()
  }
}

reset()
