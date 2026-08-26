/**
 * Diagnostico de conectividade com o MySQL.
 *
 * Uso:
 *   node --env-file-if-exists=/vercel/share/.env.project scripts/test-mysql-connection.mjs
 *
 * Nao imprime credenciais. Apenas host, porta, banco e resultados dos testes.
 */

import net from 'node:net'
import dns from 'node:dns/promises'
import mysql from 'mysql2/promise'

const AUTH_TABLES = [
  'glab_auth_user',
  'glab_auth_session',
  'glab_auth_account',
  'glab_auth_verification',
]

function line() {
  console.log('-'.repeat(52))
}

function parseUrl(raw) {
  const url = new URL(raw)
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    database: url.pathname.replace(/^\//, ''),
    hasUser: Boolean(url.username),
    hasPassword: Boolean(url.password),
  }
}

async function testDns(host) {
  try {
    const addrs = await dns.resolve4(host)
    console.log(`[1/4] DNS ......... OK (${addrs.length} endereco(s))`)
    return true
  } catch (err) {
    console.log(`[1/4] DNS ......... FALHOU (${err.code})`)
    console.log('      O hostname nao resolve. Verifique se esta correto.')
    return false
  }
}

function testTcp(host, port, timeout = 10000) {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port, timeout })
    socket.on('connect', () => {
      console.log(`[2/4] TCP ${port} ..... OK (porta acessivel)`)
      socket.destroy()
      resolve(true)
    })
    socket.on('timeout', () => {
      console.log(`[2/4] TCP ${port} ..... TIMEOUT`)
      console.log('      Provavel bloqueio de firewall / IP nao liberado.')
      socket.destroy()
      resolve(false)
    })
    socket.on('error', (err) => {
      console.log(`[2/4] TCP ${port} ..... FALHOU (${err.code})`)
      if (err.code === 'ECONNREFUSED') {
        console.log('      Host respondeu mas recusou a porta.')
      }
      resolve(false)
    })
  })
}

async function testMysql(connectionString) {
  let conn
  try {
    conn = await mysql.createConnection({
      uri: connectionString,
      connectTimeout: 15000,
    })
    const [rows] = await conn.query('SELECT VERSION() AS version')
    console.log(`[3/4] Auth MySQL .. OK (servidor ${rows[0].version})`)
    return conn
  } catch (err) {
    console.log(`[3/4] Auth MySQL .. FALHOU (${err.code || err.message})`)
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('      Usuario ou senha incorretos.')
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.log('      O banco informado nao existe.')
    } else if (err.code === 'ER_HOST_NOT_PRIVILEGED') {
      console.log('      Este IP nao esta autorizado no servidor MySQL.')
    }
    if (conn) await conn.end().catch(() => {})
    return null
  }
}

async function testTables(conn, database) {
  const [rows] = await conn.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
    [database]
  )
  const existing = new Set(
    rows.map((r) => String(r.table_name ?? r.TABLE_NAME).toLowerCase())
  )

  const missing = AUTH_TABLES.filter((t) => !existing.has(t))

  if (missing.length === 0) {
    console.log(`[4/4] Tabelas ..... OK (as ${AUTH_TABLES.length} tabelas de auth existem)`)
  } else {
    console.log(`[4/4] Tabelas ..... INCOMPLETO (${missing.length} faltando)`)
    for (const t of missing) console.log(`      falta: ${t}`)
    console.log('      Rode as migracoes em database/mysql/.')
  }

  console.log('')
  console.log(`Total de tabelas no banco: ${existing.size}`)

  if (existing.has('glab_auth_user')) {
    const [users] = await conn.query('SELECT COUNT(*) AS total FROM glab_auth_user')
    console.log(`Usuarios cadastrados: ${users[0].total}`)
  }

  return missing.length === 0
}

async function main() {
  const raw = process.env.DATABASE_URL

  line()
  console.log('  DIAGNOSTICO DE CONEXAO MYSQL')
  line()

  if (!raw) {
    console.log('DATABASE_URL nao esta definida neste ambiente.')
    console.log('Libere a variavel para o ambiente Development e rode novamente.')
    process.exit(1)
  }

  if (!raw.startsWith('mysql')) {
    console.log(`Protocolo incorreto: "${raw.split('://')[0]}"`)
    console.log('O codigo em lib/db/index.ts exige uma URL mysql://')
    process.exit(1)
  }

  let info
  try {
    info = parseUrl(raw)
  } catch (err) {
    console.log(`DATABASE_URL nao e uma URL valida: ${err.message}`)
    process.exit(1)
  }

  if (!info.hasUser || !info.hasPassword) {
    console.log('Aviso: usuario ou senha ausentes na connection string.')
  }

  console.log(`Host:  ${info.host}`)
  console.log(`Porta: ${info.port}`)
  console.log(`Banco: ${info.database || '(nao informado)'}`)
  line()

  if (!(await testDns(info.host))) process.exit(1)
  if (!(await testTcp(info.host, info.port))) {
    line()
    console.log('Conexao bloqueada antes do MySQL.')
    console.log('Na Locaweb, libere acesso remoto para o IP de saida do servidor.')
    process.exit(1)
  }

  const conn = await testMysql(raw)
  if (!conn) process.exit(1)

  const ok = await testTables(conn, info.database)
  await conn.end()

  line()
  console.log(ok ? 'RESULTADO: conexao pronta para uso.' : 'RESULTADO: conecta, mas faltam migracoes.')
  line()
}

main().catch((err) => {
  console.error('Erro inesperado:', err.message)
  process.exit(1)
})
