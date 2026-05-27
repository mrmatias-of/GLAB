import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdmin() {
  // Primeiro deletar usuário existente se houver
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existing = existingUsers?.users?.find(u => u.email === 'admin@glabcursos.com.br')
  
  if (existing) {
    console.log('Deletando usuario existente...')
    await supabase.auth.admin.deleteUser(existing.id)
  }

  // Criar novo usuario admin
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@glabcursos.com.br',
    password: 'Admin123!',
    email_confirm: true,
    user_metadata: {
      name: 'Administrador G-LAB',
      role: 'admin'
    }
  })

  if (error) {
    console.error('Erro ao criar admin:', error)
    return
  }

  console.log('Usuario admin criado com sucesso!')
  console.log('ID:', data.user.id)
  console.log('Email:', data.user.email)
  console.log('Senha: Admin123!')
}

createAdmin()
