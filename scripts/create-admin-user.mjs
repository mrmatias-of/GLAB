import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { db } from '../lib/db.ts'
import { user, account } from '../lib/db/schema.ts'
import { eq } from 'drizzle-orm'

async function createAdmin() {
  try {
    // Senha padrão (DEVE SER ALTERADA NA PRIMEIRA AUTENTICAÇÃO)
    const defaultPassword = 'Admin@12345'
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)
    const userId = randomUUID()

    console.log('🔐 Criando usuário administrador...\n')

    // Verificar se já existe
    const existing = await db
      .select()
      .from(user)
      .where(eq(user.email, 'admin@glabcursos.com'))
      .limit(1)

    if (existing.length > 0) {
      console.log('⚠️  O usuário admin@glabcursos.com já existe!')
      console.log(`   ID: ${existing[0].id}`)
      console.log(`   Nome: ${existing[0].name}`)
      console.log(`   Criado em: ${existing[0].createdAt}`)
      process.exit(0)
    }

    // Criar usuário
    await db.insert(user).values({
      id: userId,
      email: 'admin@glabcursos.com',
      name: 'Administrador',
      emailVerified: true,
    })

    // Criar account com senha
    await db.insert(account).values({
      id: randomUUID(),
      userId: userId,
      providerId: 'credential',
      accountId: 'admin-credential',
      password: hashedPassword,
    })

    console.log('✅ Usuário admin criado com sucesso!')
    console.log('\n📋 Credenciais:')
    console.log('   Email: admin@glabcursos.com')
    console.log('   Senha: Admin@12345')
    console.log('\n⚠️  IMPORTANTE:')
    console.log('   • Esta senha DEVE ser alterada na primeira autenticação')
    console.log('   • Use uma senha forte com números, letras e símbolos')
    console.log('   • Esta senha é válida apenas para setup inicial')
    console.log('\n🔗 Acesse: http://localhost:3000/login')
    console.log(`\n👤 ID do usuário: ${userId}`)
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message)
    process.exit(1)
  }
}

createAdmin()
