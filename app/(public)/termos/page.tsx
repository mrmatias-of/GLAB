import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso da plataforma G•Lab Cursos",
}

export default function TermosPage() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-10 transition-colors hover:text-white"
          style={{ color: '#71717a' }}
        >
          <ArrowLeft size={14} /> Voltar ao início
        </Link>

        <p className="eyebrow mb-3">Legal</p>
        <h1 className="section-title mb-2">Termos de Uso</h1>
        <p className="text-sm mb-10" style={{ color: '#52525b' }}>Última atualização: Janeiro de 2026</p>

        <div className="space-y-4">
          {[
            {
              title: "1. Aceitação dos Termos",
              body: "Ao acessar e utilizar a plataforma G•Lab Cursos, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.",
            },
            {
              title: "2. Descrição dos Serviços",
              body: "A G•Lab Cursos oferece conteúdo educacional digital na área de manutenção de dispositivos eletrônicos, incluindo guias técnicos, vídeos e materiais de apoio para profissionais de assistência técnica.",
            },
            {
              title: "3. Licença de Uso",
              body: "Ao adquirir um curso, você recebe uma licença pessoal, intransferível e não exclusiva para acessar o conteúdo. É proibida a reprodução, distribuição ou compartilhamento do material com terceiros.",
            },
            {
              title: "4. Conta do Usuário",
              body: "Você é responsável por manter a confidencialidade de suas credenciais de acesso. Qualquer atividade realizada em sua conta é de sua responsabilidade.",
            },
            {
              title: "5. Propriedade Intelectual",
              body: "Todo o conteúdo disponibilizado na plataforma, incluindo textos, vídeos, imagens e materiais didáticos, é de propriedade exclusiva da G•Lab Cursos e está protegido por leis de direitos autorais.",
            },
            {
              title: "6. Modificações",
              body: "Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas por e-mail ou através da plataforma.",
            },
            {
              title: "7. Contato",
              body: "Para dúvidas sobre estes termos, entre em contato através do e-mail: contato@glabcursos.com.br",
            },
          ].map((s) => (
            <section
              key={s.title}
              className="card p-6 rounded-2xl"
            >
              <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
