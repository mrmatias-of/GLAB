import pg from 'pg'
import bcrypt from 'bcryptjs'

const { Client } = pg

const adminEmail = 'admin@glabcursos.com'
const newPassword = 'Admin@123456'

async function resetAdminPassword() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('✓ Conectado ao banco Neon')

    // Buscar usuário admin
    const userResult = await client.query(
      'SELECT id, email FROM "user" WHERE email = $1',
      [adminEmail]
    )

    if (userResult.rows.length === 0) {
      console.error(`✗ Admin ${adminEmail} não encontrado`)
      return
    }

    const admin = userResult.rows[0]
    console.log(`✓ Admin encontrado: ${admin.email} (ID: ${admin.id})`)

    // Hash da nova senha com bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Atualizar senha na tabela account
    const updateResult = await client.query(
      'UPDATE account SET password = $1, "updatedAt" = NOW() WHERE "userId" = $2 RETURNING id',
      [hashedPassword, admin.id]
    )

    if (updateResult.rows.length === 0) {
      console.error('✗ Nenhuma conta encontrada para atualizar')
      return
    }

    console.log(`✓ Senha resetada com sucesso!`)
    console.log('')
    console.log('='.repeat(50))
    console.log('CREDENCIAIS DE LOGIN')
    console.log('='.repeat(50))
    console.log(`Email:    ${adminEmail}`)
    console.log(`Senha:    ${newPassword}`)
    console.log('='.repeat(50))
  } catch (error) {
    console.error('Erro ao resetar senha:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

resetAdminPassword()
