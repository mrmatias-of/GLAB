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
      'SELECT id, email FROM "user" WHERE email = $1 LIMIT 1',
      [adminEmail]
    )

    if (userResult.rows.length === 0) {
      console.error(`✗ Admin ${adminEmail} não encontrado`)
      await client.end()
      process.exit(1)
    }

    const admin = userResult.rows[0]
    console.log(`✓ Admin encontrado: ${admin.email} (ID: ${admin.id})`)

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    console.log('✓ Senha hashificada')

    // Buscar account do usuario
    const accountResult = await client.query(
      'SELECT id FROM account WHERE "userId" = $1 LIMIT 1',
      [admin.id]
    )

    let accountId
    if (accountResult.rows.length > 0) {
      accountId = accountResult.rows[0].id
      console.log(`✓ Account encontrada: ${accountId}`)
      
      // Atualizar a senha existente
      await client.query(
        'UPDATE account SET password = $1, "updatedAt" = NOW() WHERE id = $2',
        [hashedPassword, accountId]
      )
    } else {
      // Criar nova account se não existir
      console.log('⚠ Nenhuma account encontrada, criando nova...')
      const newAccountResult = await client.query(
        `INSERT INTO account (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING id`,
        [
          `account_${Date.now()}`,
          admin.id,
          `account_${Date.now()}`,
          'credential',
          hashedPassword
        ]
      )
      accountId = newAccountResult.rows[0].id
    }

    console.log(`✓ Senha resetada com sucesso!`)
    console.log('')
    console.log('='.repeat(50))
    console.log('CREDENCIAIS DE LOGIN')
    console.log('='.repeat(50))
    console.log(`Email:    ${adminEmail}`)
    console.log(`Senha:    ${newPassword}`)
    console.log('='.repeat(50))
    
    await client.end()
  } catch (error) {
    console.error('✗ Erro:', error.message)
    await client.end()
    process.exit(1)
  }
}

resetAdminPassword()
