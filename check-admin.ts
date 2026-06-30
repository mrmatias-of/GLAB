import { db } from './lib/db'
import { user, account } from './lib/db/schema'
import { eq } from 'drizzle-orm'

async function checkAdmin() {
  try {
    const adminUser = await db
      .select()
      .from(user)
      .where(eq(user.email, 'admin@glabcursos.com'))
      .limit(1)

    if (adminUser.length === 0) {
      console.log('❌ Admin user NOT found in database')
      console.log('Email: admin@glabcursos.com')
      console.log('\nYou need to create admin user first')
      process.exit(1)
    }

    console.log('✅ Admin user exists:')
    console.log(`ID: ${adminUser[0].id}`)
    console.log(`Email: ${adminUser[0].email}`)
    console.log(`Name: ${adminUser[0].name}`)

    const adminAccount = await db
      .select()
      .from(account)
      .where(eq(account.userId, adminUser[0].id))
      .limit(1)

    console.log(`\n✅ Account exists:`)
    console.log(`Provider: ${adminAccount[0].providerId}`)
    console.log(`Has password: ${adminAccount[0].password ? 'YES' : 'NO'}`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

checkAdmin()
