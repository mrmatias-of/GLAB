import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Política de Privacidade",
  description: "Saiba como o G•Lab Cursos coleta, usa e protege seus dados pessoais.",
  alternates: { canonical: "https://www.glabcursos.com.br/privacidade" },
}

export default function PrivacidadePage() {
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
          Politica de Privacidade
        </h1>
        <p className="text-xs mb-8" style={{ color: '#52525b' }}>
          Ultima atualizacao: maio de 2026
        </p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>1. Quem somos</h2>
            <p>
              O <strong style={{ color: '#fff' }}>G•Lab Cursos</strong> e um negocio digital que
              oferece guias tecnicos de assistencia mobile. O site e hospedado na{' '}
              <strong style={{ color: '#fff' }}>Vercel</strong> e os dados sao armazenados no{' '}
              <strong style={{ color: '#fff' }}>Supabase</strong> (banco de dados PostgreSQL hospedado
              na AWS). O checkout e processado pela plataforma{' '}
              <strong style={{ color: '#fff' }}>Kirvano</strong>.
            </p>
            <p className="mt-2 text-xs italic" style={{ color: '#71717a' }}>
              Pendencia: razao social, CNPJ e dados do encarregado de protecao de dados (DPO) serao
              informados pelo proprietario e incluidos nesta pagina antes do lancamento de campanhas pagas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>2. Dados coletados</h2>

            <h3 className="font-semibold mb-2" style={{ color: '#e4e4e7' }}>2.1 Formulario de contato</h3>
            <p>Quando voce envia uma mensagem pelo formulario em <code>/contato</code>, coletamos:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nome</li>
              <li>Endereco de e-mail</li>
              <li>Assunto (opcional)</li>
              <li>Mensagem</li>
              <li>Data e hora do envio</li>
            </ul>
            <p className="mt-2">
              Esses dados sao usados exclusivamente para responder a sua solicitacao. Seu consentimento
              e coletado por meio de um checkbox obrigatorio no formulario.
            </p>
            <p className="mt-2 text-xs italic" style={{ color: '#71717a' }}>
              Pendencia: a tabela de contatos no banco de dados ainda nao esta ativa. Os registros sao
              enviados via Telegram ao proprietario. Esta pagina sera atualizada apos a ativacao do
              armazenamento permanente.
            </p>

            <h3 className="font-semibold mt-4 mb-2" style={{ color: '#e4e4e7' }}>2.2 Dados de navegacao (metricas)</h3>
            <p>
              Com o seu consentimento (concedido pelo banner de privacidade), coletamos dados de
              navegacao para entender o uso do site:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Endereco IP</li>
              <li>User agent do navegador</li>
              <li>URL da pagina visitada</li>
              <li>Pagina de origem (referrer)</li>
              <li>Data e hora da visita</li>
            </ul>
            <p className="mt-2">
              Esses dados sao armazenados no <strong style={{ color: '#fff' }}>Supabase</strong> na
              tabela <code>visitors</code>. Nao sao compartilhados com terceiros e sao usados apenas
              internamente para analise de trafego.
            </p>
            <p className="mt-2">
              Alem disso, quando voce permite metricas, carregamos os servicos{' '}
              <strong style={{ color: '#fff' }}>Vercel Analytics</strong> e{' '}
              <strong style={{ color: '#fff' }}>Vercel Speed Insights</strong>, que coletam metricas
              anonimas de desempenho e pageviews conforme a{' '}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-cyan-400 transition-colors"
                style={{ color: '#00D4C8' }}
              >
                politica de privacidade da Vercel
              </a>.
            </p>
            <p className="mt-2">
              Se voce escolher &quot;Somente essenciais&quot;, nenhum dado de navegacao e coletado.
            </p>

            <h3 className="font-semibold mt-4 mb-2" style={{ color: '#e4e4e7' }}>2.3 Compras e webhook</h3>
            <p>
              O checkout e processado integralmente pela <strong style={{ color: '#fff' }}>Kirvano</strong>.
              O G•Lab Cursos recebe notificacoes automaticas (webhook) com dados da transacao, incluindo:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nome e e-mail do comprador</li>
              <li>Produto adquirido</li>
              <li>Valor e metodo de pagamento</li>
              <li>Status da transacao (aprovada, cancelada, reembolsada)</li>
            </ul>
            <p className="mt-2">
              Esses dados sao armazenados nas tabelas <code>purchases</code> e{' '}
              <code>webhook_logs</code> no Supabase e tambem encaminhados ao proprietario via Telegram
              para controle operacional.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>3. Finalidade e base legal</h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Responder solicitacoes de contato (base: consentimento)</li>
              <li>Analisar o uso do site e melhorar a experiencia (base: consentimento, quando concedido)</li>
              <li>Registrar e confirmar transacoes de compra (base: execucao de contrato)</li>
              <li>Cumprir obrigacoes legais quando aplicavel</li>
            </ul>
            <p className="mt-2 text-xs italic" style={{ color: '#71717a' }}>
              Pendencia: as bases legais formais da LGPD (Lei 13.709/2018) serao revisadas e detalhadas
              pelo proprietario ou por assessoria juridica antes do lancamento de campanhas pagas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>4. Compartilhamento de dados</h2>
            <p>Seus dados nao sao vendidos. Sao compartilhados apenas com:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong style={{ color: '#fff' }}>Kirvano</strong> — para processar pagamentos
                (conforme os termos de servico da Kirvano)
              </li>
              <li>
                <strong style={{ color: '#fff' }}>Supabase / AWS</strong> — para armazenamento
                seguro de dados (conforme a politica de privacidade do Supabase)
              </li>
              <li>
                <strong style={{ color: '#fff' }}>Vercel</strong> — para hospedagem e metricas
                anonimas (conforme a politica de privacidade da Vercel)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>5. Retencao de dados</h2>
            <p>
              Os dados de navegacao coletados com consentimento sao mantidos enquanto forem uteis para
              analise interna. Os dados de transacoes sao mantidos pelo periodo necessario para fins
              contabeis e legais.
            </p>
            <p className="mt-2 text-xs italic" style={{ color: '#71717a' }}>
              Pendencia: os prazos exatos de retencao serao definidos pelo proprietario.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>6. Seus direitos</h2>
            <p>Conforme a LGPD, voce tem direito a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Confirmar a existencia de tratamento dos seus dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusao de dados coletados com base em consentimento</li>
              <li>Revogar o consentimento a qualquer momento (via &quot;Preferencias de privacidade&quot; no rodape do site)</li>
            </ul>
            <p className="mt-2">
              Para exercer qualquer desses direitos, utilize nossa{' '}
              <Link href="/contato" className="underline hover:text-cyan-400 transition-colors" style={{ color: '#00D4C8' }}>
                pagina de contato
              </Link>{' '}
              ou envie e-mail para{' '}
              <a href="mailto:contato@glabcursos.com.br" className="underline hover:text-cyan-400 transition-colors" style={{ color: '#00D4C8' }}>
                contato@glabcursos.com.br
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>7. Preferencias de privacidade</h2>
            <p>
              Voce pode alterar sua escolha sobre metricas a qualquer momento clicando em{' '}
              &quot;Preferencias de privacidade&quot; no rodape do site. Ao revogar o consentimento,
              os scripts de metricas sao descarregados na proxima navegacao.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>8. Seguranca</h2>
            <p>
              Os dados sao transmitidos via HTTPS e armazenados no Supabase com criptografia em
              repouso. O acesso ao banco e restrito por chave de servico (service role key) que nao
              e exposta ao cliente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>9. Atualizacoes desta politica</h2>
            <p>
              Esta politica pode ser atualizada para refletir mudancas tecnicas ou legais. A data de
              ultima atualizacao e indicada no inicio da pagina.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
