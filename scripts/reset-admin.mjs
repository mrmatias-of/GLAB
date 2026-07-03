import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const NEW_PASSWORD = 'Glab@2025!'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function resetAdmin() {
  const client = await pool.connect()
  try {
    // Buscar usuário admin
    const { rows: users } = await client.query(
      `SELECT id, email, name FROM "user" WHERE email = $1 LIMIT 1`,
      ['admin@glabcursos.com']
    )

    if (users.length === 0) {
      console.log('ERRO: usuario admin@glabcursos.com nao encontrado no banco.')
      process.exit(1)
    }

    const adminUser = users[0]
    console.log(`Encontrado: ${adminUser.name} (${adminUser.email}) — ID: ${adminUser.id}`)

    // Gerar novo hash
    const hash = await bcrypt.hash(NEW_PASSWORD, 12)

    // Atualizar ou inserir na tabela account
    const { rows: accounts } = await client.query(
      `SELECT id FROM "account" WHERE "userId" = $1 AND "providerId" = 'credential' LIMIT 1`,
      [adminUser.id]
    )

    if (accounts.length > 0) {
      await client.query(
        `UPDATE "account" SET password = $1 WHERE "userId" = $2 AND "providerId" = 'credential'`,
        [hash, adminUser.id]
      )
      console.log('Senha atualizada com sucesso.')
    } else {
      await client.query(
        `INSERT INTO "account" ("id", "userId", "providerId", "accountId", "password", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, 'credential', $2, $3, NOW(), NOW())`,
        [adminUser.id, adminUser.email, hash]
      )
      console.log('Account criada e senha definida com sucesso.')
    }

    console.log('\n--- CREDENCIAIS ADMIN ---')
    console.log(`Email:  admin@glabcursos.com`)
    console.log(`Senha:  ${NEW_PASSWORD}`)
    console.log('-------------------------')
  } finally {
    client.release()
    await pool.end()
  }
}

resetAdmin().catch((err) => {
  console.error('Erro ao resetar senha:', err.message)
  process.exit(1)
})
