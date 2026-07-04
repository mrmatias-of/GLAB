/**
 * Reset admin password using the same hashing that Better Auth uses internally.
 * Better Auth uses scrypt via the @node-rs/bcrypt package. However, since we
 * can't easily import the server bundle, we use the pg client directly and
 * update the password hash using bcrypt (which the custom /api/auth/signin route
 * also validates). The Better Auth signIn.email() on the client side will use
 * the Better Auth server which hashes with scrypt. We need to let Better Auth
 * create the account record the right way.
 *
 * STRATEGY: Use the Better Auth API directly to create/update the admin.
 */

import pg from 'pg'

const { Client } = pg

const DB_URL = process.env.DATABASE_URL
const ADMIN_EMAIL = 'admin@glabcursos.com'
const NEW_PASSWORD = 'Admin@G1ab2025'

if (!DB_URL) {
  console.error('DATABASE_URL nao definida')
  process.exit(1)
}

const client = new Client({ connectionString: DB_URL })
await client.connect()

// Descobrir o hash algorithm que Better Auth usa
// Better Auth v1 usa scrypt internamente via its own crypto
// Mas a tabela account.password guarda o hash — vamos ver o formato atual
const accountRows = await client.query(`
  SELECT a.id, a."accountId", a."providerId", a.password, u.email
  FROM account a
  JOIN "user" u ON u.id = a."userId"
  WHERE u.email = $1
  LIMIT 5
`, [ADMIN_EMAIL])

console.log('Registros account para admin:')
console.log(JSON.stringify(accountRows.rows.map(r => ({
  ...r,
  password: r.password ? r.password.substring(0, 30) + '...' : null
})), null, 2))

// Ver formato do hash para saber qual algoritmo
if (accountRows.rows.length > 0) {
  const hash = accountRows.rows[0].password
  if (hash) {
    if (hash.startsWith('$2')) console.log('\nAlgoritmo: bcrypt')
    else if (hash.startsWith('$s0$') || hash.startsWith('scrypt')) console.log('\nAlgoritmo: scrypt')
    else console.log('\nFormato do hash:', hash.substring(0, 20))
  }
}

await client.end()
console.log('\nDiagnostico completo. Cole o resultado acima.')
