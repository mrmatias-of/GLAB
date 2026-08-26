import { Metadata } from 'next'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Configurações | Painel Admin',
  description: 'Status das configurações operacionais da plataforma',
}

export const dynamic = 'force-dynamic'

function StatusRow({ label, ok, description }: { label: string; ok: boolean; description: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-white/10 py-5 last:border-0">
      <span className={ok ? 'mt-0.5 text-emerald-300' : 'mt-0.5 text-amber-300'}>
        {ok ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
      </span>
      <div>
        <p className="font-bold">{label}</p>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
    </div>
  )
}

export default function ConfiguracoesPage() {
  const hasAdminEmails = Boolean(process.env.GLAB_ADMIN_EMAILS?.trim())
  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
  const requireEmailVerification = false // mantido em sincronia com lib/auth.ts

  return (
    <div className="space-y-8 text-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Operação</p>
        <h1 className="mt-2 text-3xl font-black">Configurações</h1>
        <p className="mt-2 text-sm text-slate-400">Status das variáveis de ambiente que controlam autenticação e envio de e-mail. Ajustes ficam no painel de variáveis do projeto.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
        <StatusRow
          label="Administradores da plataforma"
          ok={hasAdminEmails}
          description={
            hasAdminEmails
              ? 'GLAB_ADMIN_EMAILS está configurada — os e-mails definidos nessa variável têm acesso ao /admin.'
              : 'GLAB_ADMIN_EMAILS não está configurada. Um e-mail fixo temporário (admin@glabcursos.com.br) está sendo usado como fallback no código. Configure a variável de ambiente e remova o fallback.'
          }
        />
        <StatusRow
          label="Envio de e-mail (SMTP)"
          ok={hasSmtp}
          description={
            hasSmtp
              ? 'Credenciais SMTP configuradas — e-mails de recuperação de senha são enviados normalmente.'
              : 'SMTP_HOST, SMTP_USER e SMTP_PASSWORD não estão configuradas. Nenhum e-mail transacional é enviado de verdade; apenas registrado no log do servidor.'
          }
        />
        <StatusRow
          label="Confirmação de e-mail no cadastro"
          ok={requireEmailVerification}
          description={
            requireEmailVerification
              ? 'Cadastros exigem confirmação por e-mail antes de liberar o acesso.'
              : 'Desativada temporariamente porque o SMTP não está configurado. Assim que o SMTP estiver ativo, reative requireEmailVerification em lib/auth.ts.'
          }
        />
      </div>
    </div>
  )
}
