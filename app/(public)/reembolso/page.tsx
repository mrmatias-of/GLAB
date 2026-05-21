import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de Reembolso",
  description: "Política de reembolso e garantia dos cursos G•Lab",
}

export default function ReembolsoPage() {
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
        <h1 className="section-title mb-2">Política de Reembolso</h1>
        <p className="text-sm mb-10" style={{ color: '#52525b' }}>Última atualização: Janeiro de 2026</p>

        {/* Destaque garantia */}
        <div
          className="flex items-start gap-4 rounded-2xl p-6 mb-10"
          style={{ backgroundColor: '#111113', border: '1px solid #3730a3' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)' }}
          >
            <ShieldCheck size={22} style={{ color: '#818cf8' }} />
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-1">Garantia incondicional de 7 dias</p>
            <p className="text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>
              Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do valor pago, sem questionamentos.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "Como Solicitar Reembolso",
              body: "Para solicitar o reembolso dentro do prazo de 7 dias, envie um e-mail para contato@glabcursos.com.br informando seu nome completo, e-mail de cadastro e o curso que deseja reembolso.",
            },
            {
              title: "Prazo de Processamento",
              body: "Após a solicitação, o reembolso será processado em até 5 dias úteis. O valor será estornado na mesma forma de pagamento utilizada na compra.",
            },
            {
              title: "Acesso ao Conteúdo",
              body: "Após o reembolso ser processado, o acesso ao curso será automaticamente revogado. Caso deseje readquirir o curso futuramente, será necessária uma nova compra.",
            },
            {
              title: "Exceções",
              body: "A política de reembolso não se aplica a: solicitações feitas após o prazo de 7 dias, cursos adquiridos em promoções com termos específicos, e casos de uso indevido ou compartilhamento de acesso.",
            },
            {
              title: "Dúvidas",
              body: "Se tiver dúvidas sobre nossa política de reembolso, entre em contato pelo WhatsApp ou e-mail: contato@glabcursos.com.br",
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
