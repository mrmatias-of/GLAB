import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eglftcvmpapvnucbxwci.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbGZ0Y3ZtcGFwdm51Y2J4d2NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTExMDgyMCwiZXhwIjoyMDk0Njg2ODIwfQ.pRo571VuA6OACZ-1cNjfHu25mGGh4V7TkOQgWgxg0_E'

const adminEmail = 'admin@glabcursos.com'
const adminPassword = 'Admin@12345'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function createAdmin() {
  try {
    console.log('Criando usuário admin...')
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        is_admin: true
      }
    })

    if (error) {
      console.error('Erro ao criar usuário:', error.message)
      process.exit(1)
    }

    console.log('\n✓ Usuário admin criado com sucesso!\n')
    console.log('Email:', adminEmail)
    console.log('Senha:', adminPassword)
    console.log('UUID:', data.user.id)
    console.log('\nGuarde estas credenciais em local seguro!')
    
  } catch (err) {
    console.error('Erro:', err.message)
    process.exit(1)
  }
}

createAdmin()
