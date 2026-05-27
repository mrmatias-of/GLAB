import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Env vars SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidas");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function resetAdminPassword() {
  const email = "admin@glabcursos.com.br";
  const newPassword = "E7OJiZmQfsuFqzx7";

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      "74257856-4f9b-4aa9-9bea-b21f60768b27", // ID do user admin@glabcursos.com.br
      { password: newPassword }
    );

    if (error) {
      console.error("❌ Erro ao resetar senha:", error.message);
      process.exit(1);
    }

    console.log("✅ Senha do admin resetada com sucesso!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Nova Senha: ${newPassword}`);
    console.log("");
    console.log("Você pode fazer login em: https://glabcursos.com.br/login");
  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
}

resetAdminPassword();
