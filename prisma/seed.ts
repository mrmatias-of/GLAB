import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Criar usuário admin
  const adminEmail = 'admin@glabcursos.com'
  const adminPassword = 'Larissa@123'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log(`✓ Admin user already exists: ${adminEmail}`)
    return
  }

  const hashedPassword = await hashPassword(adminPassword)

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin G•Lab',
      is_admin: true,
      is_vendedor: false,
    },
  })

  console.log(`✓ Created admin user: ${admin.email}`)
  console.log(`  Email: ${admin.email}`)
  console.log(`  Password: ${adminPassword}`)
  console.log(`  Is Admin: ${admin.is_admin}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
