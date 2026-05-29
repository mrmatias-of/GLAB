import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do G•Lab Cursos.",
  alternates: { canonical: "https://www.glabcursos.com.br/termos" },
}

export default function TermosPage() {
  return (
    <main className="min-h-screen py-20 px-4" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors"
          style={{ color: '#71717a' }}
        >
          <ArrowLeft size={16} />
          Voltar ao inicio
        </Link>

        <h1 className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>
          Termos de Uso
        </h1>
        <p className="text-xs mb-8" style={{ color: '#52525b' }}>
          Ultima atualizacao: maio de 2026
        </p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>1. Aceitacao dos Termos</h2>
            <p>
              Ao acessar e utilizar o <strong style={{ color: '#fff' }}>G•Lab Cursos</strong> (
              <code>www.glabcursos.com.br</code>), voce concorda com estes Termos de Uso. Se nao
              concordar, nao utilize o site ou seus produtos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>2. Natureza dos produtos</h2>
            <p>
              O G•Lab Cursos oferece <strong style={{ color: '#fff' }}>guias tecnicos digitais</strong>{' '}
              (chamados de &quot;guias&quot; ou &quot;cursos&quot;) sobre assistencia tecnica mobile e
              temas relacionados. Todo o conteudo e de natureza educacional e digital — nao ha envio
              de materiais fisicos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>3. Acesso ao conteudo</h2>
            <p>
              Apos a confirmacao do pagamento pela <strong style={{ color: '#fff' }}>Kirvano</strong>,
              o acesso ao produto adquirido e disponibilizado pela propria plataforma da Kirvano.
              O G•Lab Cursos nao mantém painel de aluno proprio.
            </p>
            <p className="mt-2">
              Condicoes especificas de acesso, quando aplicaveis, constam na oferta correspondente
              ou no ambiente da Kirvano.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>5. Uso do conteudo</h2>
            <p>Todo o conteudo disponibilizado e protegido por direitos autorais. Voce pode:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Acessar o conteudo para uso pessoal e educacional</li>
              <li>Consultar os materiais quantas vezes quiser dentro do prazo de acesso</li>
              <li>Fazer anotacoes para estudo pessoal</li>
            </ul>
            <p className="mt-3">Voce NAO pode:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Compartilhar seu acesso com terceiros</li>
              <li>Copiar, distribuir ou revender o conteudo</li>
              <li>Gravar ou reproduzir os materiais</li>
              <li>Utilizar o conteudo para fins comerciais sem autorizacao expressa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>6. Pagamentos e checkout</h2>
            <p>
              Todos os pagamentos sao processados pela{' '}
              <strong style={{ color: '#fff' }}>Kirvano</strong>. Ao clicar em um botao de compra voce
              e redirecionado para o ambiente seguro da Kirvano. O G•Lab Cursos nao armazena dados
              de cartao de credito ou informacoes financeiras.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>7. Cancelamento e reembolso</h2>
            <p>
              Em conformidade com o Codigo de Defesa do Consumidor (Art. 49), voce pode solicitar o
              cancelamento da compra em ate <strong style={{ color: '#fff' }}>7 dias</strong> apos a
              data de aquisicao, para compras realizadas fora do estabelecimento comercial (inclusive
              pela internet). A solicitacao deve ser feita diretamente pela plataforma{' '}
              <strong style={{ color: '#fff' }}>Kirvano</strong> ou pelo canal de suporte indicado abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>8. Suporte</h2>
            <p>
              Para duvidas sobre conteudo, acesso ou reembolso, entre em contato por meio da nossa{' '}
              <Link href="/contato" className="underline hover:text-cyan-400 transition-colors" style={{ color: '#00D4C8' }}>
                pagina de contato
              </Link>{' '}
              ou pelo e-mail{' '}
              <a href="mailto:contato@glabcursos.com.br" className="underline hover:text-cyan-400 transition-colors" style={{ color: '#00D4C8' }}>
                contato@glabcursos.com.br
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>9. Modificacoes</h2>
            <p>
              Reservamos o direito de modificar estes termos a qualquer momento. A data de ultima
              atualizacao e indicada no inicio desta pagina. O uso continuado do site apos alteracoes
              implica aceitacao dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>10. Privacidade</h2>
            <p>
              O tratamento dos seus dados pessoais e descrito na nossa{' '}
              <Link href="/privacidade" className="underline hover:text-cyan-400 transition-colors" style={{ color: '#00D4C8' }}>
                Politica de Privacidade
              </Link>.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
