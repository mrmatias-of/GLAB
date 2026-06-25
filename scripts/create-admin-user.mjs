import { prisma } from '../lib/db.js'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

async function createAdmin() {
  try {
    const password = '@Monteiro21'
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = randomUUID()

    const user = await prisma.user.create({
      data: {
        id: userId,
        email: 'admin@glabcursos.com',
        password: hashedPassword,
        name: 'Admin',
        is_admin: true,
        is_vendedor: false,
      },
    })

    console.log('✅ Usuário admin criado com sucesso!')
    console.log('\n📋 Credenciais:')
    console.log('   Email: admin@glabcursos.com')
    console.log('   Senha: @Monteiro21')
    console.log('\n🔗 Acesse: https://glabcursos.com.br/login')
    console.log('\nID do usuário:', userId)
  } catch (error) {
    console.error('❌ Erro:', error.message)
    if (error.code === 'P2002') {
      console.log('\n⚠️  O usuário admin@glabcursos.com já existe!')
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
