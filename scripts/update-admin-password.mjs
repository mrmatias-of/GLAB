import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateAdminPassword() {
  try {
    console.log('🔍 Procurando usuário admin...');
    
    // Primeiro encontra o usuário pelo email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError.message);
      process.exit(1);
    }

    const adminUser = users.users.find(u => u.email === 'admin@glabcursos.com');
    
    if (!adminUser) {
      console.error('❌ Usuário admin não encontrado');
      process.exit(1);
    }

    console.log('🔄 Atualizando senha do admin...');
    
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { password: '@Monteiro21' }
    );

    if (error) {
      console.error('❌ Erro ao atualizar senha:', error.message);
      process.exit(1);
    }

    console.log('✅ Senha do admin atualizada com sucesso!');
    console.log('\n📋 Credenciais atualizadas:');
    console.log('   Email: admin@glabcursos.com');
    console.log('   Senha: @Monteiro21');
    console.log('\n🔗 Acesse: https://glabcursos.com.br/login');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

updateAdminPassword();
