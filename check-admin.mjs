import { db } from './lib/db.ts'
import { user, account } from './lib/db/schema.ts'
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
      console.log('   Email: admin@glabcursos.com')
      console.log('\nYou need to run: node scripts/create-admin-user.mjs')
      process.exit(1)
    }

    console.log('✅ Admin user found:')
    console.log(`   ID: ${adminUser[0].id}`)
    console.log(`   Email: ${adminUser[0].email}`)
    console.log(`   Name: ${adminUser[0].name}`)
    console.log(`   Created: ${adminUser[0].createdAt}`)

    // Check account/password
    const adminAccount = await db
      .select()
      .from(account)
      .where(eq(account.userId, adminUser[0].id))
      .limit(1)

    if (adminAccount.length === 0) {
      console.log('\n⚠️  WARNING: No account/password found for this user')
      console.log('   Run: node scripts/create-admin-user.mjs again')
      process.exit(1)
    }

    console.log('\n✅ Account/Password found:')
    console.log(`   Provider: ${adminAccount[0].providerId}`)
    console.log(`   Password hash: ${adminAccount[0].password ? 'Set' : 'NOT SET'}`)

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkAdmin()
