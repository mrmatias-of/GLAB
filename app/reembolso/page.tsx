import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Reembolso — G•Lab Cursos",
  description: "Política de reembolso e garantia dos cursos G•Lab",
}

export default function ReembolsoPage() {
  return (
    <main className="min-h-screen px-6 py-20" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="section-title mb-8">Política de Reembolso</h1>
        
        <div className="prose prose-invert max-w-none space-y-6" style={{ color: '#a1a1aa' }}>
          <p className="text-sm leading-relaxed">
            Última atualização: Janeiro de 2026
          </p>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Garantia de 7 Dias</h2>
            <p className="text-sm leading-relaxed">
              Oferecemos garantia incondicional de 7 dias para todos os nossos cursos. 
              Se por qualquer motivo você não ficar satisfeito com o conteúdo, 
              devolveremos 100% do valor pago, sem questionamentos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Como Solicitar Reembolso</h2>
            <p className="text-sm leading-relaxed">
              Para solicitar o reembolso dentro do prazo de 7 dias:
            </p>
            <ul className="list-disc list-inside text-sm leading-relaxed mt-2 space-y-1">
              <li>Envie um e-mail para contato@glabcursos.com.br</li>
              <li>Informe seu nome completo e e-mail de cadastro</li>
              <li>Indique o curso que deseja reembolso</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Prazo de Processamento</h2>
            <p className="text-sm leading-relaxed">
              Após a solicitação, o reembolso será processado em até 5 dias úteis. 
              O valor será estornado na mesma forma de pagamento utilizada na compra.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Acesso ao Conteúdo</h2>
            <p className="text-sm leading-relaxed">
              Após o reembolso ser processado, o acesso ao curso será automaticamente revogado. 
              Caso deseje readquirir o curso futuramente, será necessária uma nova compra.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Exceções</h2>
            <p className="text-sm leading-relaxed">
              A política de reembolso não se aplica a:
            </p>
            <ul className="list-disc list-inside text-sm leading-relaxed mt-2 space-y-1">
              <li>Solicitações feitas após o prazo de 7 dias</li>
              <li>Cursos adquiridos em promoções com termos específicos</li>
              <li>Casos de uso indevido ou compartilhamento de acesso</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Dúvidas</h2>
            <p className="text-sm leading-relaxed">
              Se tiver dúvidas sobre nossa política de reembolso, entre em contato pelo 
              WhatsApp ou e-mail: contato@glabcursos.com.br
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
