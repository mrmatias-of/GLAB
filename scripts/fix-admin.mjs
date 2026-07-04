import pg from 'pg'
import bcrypt from 'bcryptjs'

const { Client } = pg
const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

const ADMIN_EMAIL = 'admin@glabcursos.com'
const NEW_PASSWORD = 'Admin@G1ab2025'

// 1. Buscar o usuario
const userRes = await client.query(
  'SELECT id, email, name FROM "user" WHERE email = $1 LIMIT 1',
  [ADMIN_EMAIL]
)

if (userRes.rows.length === 0) {
  console.log('Admin nao encontrado, criando...')
  // Criar usuario admin
  const userId = `admin_${Date.now()}`
  await client.query(
    'INSERT INTO "user" (id, "tenantId", name, email, "emailVerified", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, true, NOW(), NOW())',
    [userId, 'glab', 'Administrador', ADMIN_EMAIL]
  )
  
  const hash = await bcrypt.hash(NEW_PASSWORD, 12)
  const accountId = `acc_${Date.now()}`
  await client.query(
    'INSERT INTO account (id, "tenantId", "accountId", "providerId", userid, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
    [accountId, 'glab', ADMIN_EMAIL, 'credential', userId, hash]
  )
  console.log('Admin criado com sucesso!')
} else {
  const adminId = userRes.rows[0].id
  console.log('Admin encontrado:', adminId)

  // 2. Checar account existente
  const accRes = await client.query(
    'SELECT id, password FROM account WHERE userid = $1 AND "providerId" = $2 LIMIT 1',
    [adminId, 'credential']
  )

  const hash = await bcrypt.hash(NEW_PASSWORD, 12)

  if (accRes.rows.length === 0) {
    // Criar account
    const accountId = `acc_${Date.now()}`
    await client.query(
      'INSERT INTO account (id, "tenantId", "accountId", "providerId", userid, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
      [accountId, 'glab', ADMIN_EMAIL, 'credential', adminId, hash]
    )
    console.log('Account criada!')
  } else {
    // Atualizar senha
    await client.query(
      'UPDATE account SET password = $1, "updatedAt" = NOW() WHERE userid = $2 AND "providerId" = $3',
      [hash, adminId, 'credential']
    )
    console.log('Senha atualizada!')
  }
}

await client.end()

console.log('')
console.log('================================================')
console.log('  CREDENCIAIS DO ADMIN')
console.log('================================================')
console.log('  Email:  ' + ADMIN_EMAIL)
console.log('  Senha:  ' + NEW_PASSWORD)
console.log('================================================')
