import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de Privacidade — G•Lab Cursos",
  description: "Política de privacidade e proteção de dados da G•Lab Cursos",
}

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen px-6 py-16" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-8 transition-colors hover:text-white" style={{ color: '#71717a' }}>
          <ArrowLeft size={14} /> Voltar
        </Link>
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="section-title mb-10">Política de Privacidade</h1>

        <div className="space-y-8" style={{ color: '#a1a1aa' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>Última atualização: Janeiro de 2026</p>

          {[
            {
              title: "1. Coleta de Dados",
              body: "Coletamos informações pessoais que você nos fornece diretamente, como nome, e-mail e telefone ao criar uma conta ou realizar uma compra. Também coletamos dados de navegação automaticamente.",
            },
            {
              title: "2. Uso das Informações",
              body: "Utilizamos seus dados para: processar compras, fornecer acesso aos cursos, enviar comunicações sobre atualizações e novos conteúdos, e melhorar nossos serviços.",
            },
            {
              title: "3. Compartilhamento de Dados",
              body: "Não vendemos ou alugamos suas informações pessoais. Podemos compartilhar dados com prestadores de serviços essenciais (processadores de pagamento, hospedagem) que seguem padrões adequados de segurança.",
            },
            {
              title: "4. Segurança",
              body: "Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração ou destruição.",
            },
            {
              title: "5. Cookies",
              body: "Utilizamos cookies para melhorar sua experiência de navegação, lembrar preferências e analisar o uso da plataforma. Você pode configurar seu navegador para recusar cookies.",
            },
            {
              title: "6. Seus Direitos (LGPD)",
              body: "Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar seus dados, corrigi-los, solicitar exclusão, e revogar consentimento. Para exercer esses direitos, entre em contato conosco.",
            },
            {
              title: "7. Contato",
              body: "Para questões sobre privacidade: contato@glabcursos.com.br",
            },
          ].map((s) => (
            <section key={s.title} className="card p-6 rounded-2xl">
              <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">{s.title}</h2>
              <p className="text-sm leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
