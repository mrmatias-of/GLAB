"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen py-20 px-4" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors"
          style={{ color: "#71717a" }}
        >
          <ArrowLeft size={16} />
          Voltar ao inicio
        </Link>

        <h1 className="text-3xl font-bold mb-2" style={{ color: "#fff" }}>
          Politica de Privacidade
        </h1>
        <p className="text-xs mb-10" style={{ color: "#52525b" }}>
          Ultima atualizacao: maio de 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>

          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#fff" }}>
              1. Quem somos
            </h2>
            <p>
              O <strong style={{ color: "#fff" }}>G Lab Cursos</strong> e um negocio digital que
              apresenta e comercializa guias tecnicos de assistencia mobile. O site e hospedado na{" "}
              <strong style={{ color: "#fff" }}>Vercel</strong>. Dados operacionais sao armazenados
              no <strong style={{ color: "#fff" }}>Supabase</strong> (banco PostgreSQL na AWS).
            </p>
            <p className="mt-2">
              A compra, o pagamento e a entrega dos guias sao processados exclusivamente pela{" "}
              <strong style={{ color: "#fff" }}>Kirvano</strong>, plataforma externa de checkout e
              entrega digital. O G Lab Cursos nao processa pagamentos nem libera acessos
              diretamente.
            </p>
            <p className="mt-2">
              Para duvidas sobre privacidade, utilize a{" "}
              <Link
                href="/contato"
                className="underline hover:opacity-80 transition-opacity"
                style={{ color: "#00D4C8" }}
              >
                pagina de contato
              </Link>{" "}
              ou envie e-mail para{" "}
              <a
                href="mailto:contato@glabcursos.com.br"
                className="underline hover:opacity-80 transition-opacity"
                style={{ color: "#00D4C8" }}
              >
                contato@glabcursos.com.br
              </a>
              .
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#fff" }}>
              2. Dados coletados e suas finalidades
            </h2>

            <h3 className="font-medium mb-1 mt-3" style={{ color: "#e4e4e7" }}>
              2.1 Formulario de contato
            </h3>
            <p>
              Quando voce preenche o formulario de contato, coletamos nome, e-mail e mensagem, com
              base no seu consentimento expresso (checkbox obrigatorio). Esses dados sao usados
              exclusivamente para responder a sua solicitacao e encaminhados ao proprietario via
              mensagem privada.
            </p>

            <h3 className="font-medium mb-1 mt-4" style={{ color: "#e4e4e7" }}>
              2.2 Dados de navegacao (somente com consentimento)
            </h3>
            <p>
              Se voce clicar em <em>"Permitir metricas"</em> no banner de consentimento, o site
              podera registrar dados tecnicos de navegacao, como pagina visitada, referencia de
              origem, navegador/dispositivo, endereco IP e data/hora de acesso, para analise
              interna de uso e desempenho. Esses dados sao armazenados no Supabase e processados
              pela Vercel Analytics.
            </p>
            <p className="mt-2">
              Nenhum dado de metricas opcionais e coletado pelo VisitorTracker quando voce escolhe{" "}
              <em>"Somente essenciais"</em>. Dados enviados voluntariamente pelo formulario de
              contato e registros operacionais necessarios a compras realizadas na Kirvano seguem
              as finalidades descritas nesta politica.
            </p>
            <p className="mt-2">
              Voce pode alterar sua preferencia a qualquer momento pelo link{" "}
              <strong style={{ color: "#fff" }}>Preferencias de privacidade</strong> no rodape do
              site.
            </p>

            <h3 className="font-medium mb-1 mt-4" style={{ color: "#e4e4e7" }}>
              2.3 Notificacoes operacionais de venda (webhook Kirvano)
            </h3>
            <p>
              Quando uma venda, reembolso ou chargeback e confirmado pela Kirvano, ela envia uma
              notificacao automatica para o site. O tratamento desses dados e dividido em duas
              etapas distintas:
            </p>

            <p className="mt-3 font-medium" style={{ color: "#e4e4e7" }}>
              Registro no banco
            </p>
            <p className="mt-1">
              O site mantem registro operacional minimo contendo tipo de evento, identificador da
              venda, status e data/hora de processamento.
            </p>

            <p className="mt-3 font-medium" style={{ color: "#e4e4e7" }}>
              Notificacao administrativa
            </p>
            <p className="mt-1">
              Para monitoramento operacional, uma notificacao administrativa pode ser enviada por
              Telegram contendo tipo do evento, produto, valor, identificador da venda e forma de
              pagamento, sem nome, e-mail, telefone, CPF ou dados completos de pagamento do
              comprador.
            </p>

            <p className="mt-3">
              <strong style={{ color: "#fff" }}>Nao sao armazenados</strong> pelo site: nome do
              comprador, e-mail, CPF, telefone, endereco, dados bancarios, QR Code PIX, linha
              digitavel de boleto, payload completo da notificacao ou qualquer outro dado pessoal
              do comprador. Esses dados permanecem exclusivamente na Kirvano.
            </p>
            <p className="mt-2">
              Para novos eventos processados apos a atualizacao desta politica (maio de 2026), o
              site nao armazena payload completo, CPF, telefone, e-mail ou dados detalhados de
              pagamento recebidos em notificacoes da Kirvano.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#fff" }}>
              3. Bases legais (LGPD — Lei 13.709/2018)
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong style={{ color: "#fff" }}>Consentimento</strong> — formulario de contato e
                dados de navegacao (voce pode revogar a qualquer momento)
              </li>
              <li>
                <strong style={{ color: "#fff" }}>Execucao de contrato</strong> — notificacoes
                operacionais de venda recebidas da Kirvano
              </li>
              <li>
                <strong style={{ color: "#fff" }}>Obrigacao legal</strong> — retencao de registros
                quando exigido por lei
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#fff" }}>
              4. Compartilhamento de dados
            </h2>
            <p>Os dados coletados pelo site sao processados pelos seguintes prestadores:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong style={{ color: "#fff" }}>Vercel</strong> — hospedagem do site e analytics
                de navegacao (quando autorizado)
              </li>
              <li>
                <strong style={{ color: "#fff" }}>Supabase / AWS</strong> — armazenamento do banco
                de dados
              </li>
              <li>
                <strong style={{ color: "#fff" }}>Kirvano</strong> — plataforma de checkout e
                entrega; responsavel pelos dados completos de pagamento e cadastro do comprador
              </li>
              <li>
                <strong style={{ color: "#fff" }}>Telegram</strong> — envio de notificacoes
                administrativas minimas sobre eventos de venda, reembolso ou chargeback (tipo do
                evento, produto, valor, identificador da venda e forma de pagamento)
              </li>
            </ul>
            <p className="mt-2">
              Nao vendemos, cedemos ou compartilhamos dados pessoais com terceiros para fins
              comerciais ou de marketing.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#fff" }}>
              5. Retencao dos dados
            </h2>
            <p>
              Dados de navegacao coletados com consentimento sao mantidos pelo periodo necessario
              para analise interna. Registros operacionais de venda sao mantidos pelo periodo
              necessario para fins contabeis e legais. Dados do formulario de contato sao usados
              apenas para responder a solicitacao e nao sao retidos apos o atendimento.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#fff" }}>
              6. Seus direitos (LGPD)
            </h2>
            <p>Voce tem direito a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Confirmar se seus dados sao tratados pelo site</li>
              <li>Acessar os dados que temos sobre voce</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a exclusao de dados coletados com base em consentimento</li>
              <li>Revogar o consentimento para coleta de metricas a qualquer momento</li>
              <li>Obter informacao sobre com quem seus dados foram compartilhados</li>
            </ul>
            <p className="mt-2">
              Para exercer qualquer desses direitos, utilize o canal de contato indicado na secao 1
              desta politica.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#fff" }}>
              7. Cookies e armazenamento local
            </h2>
            <p>
              O site utiliza o <code style={{ color: "#e4e4e7" }}>localStorage</code> do navegador
              para salvar sua preferencia de consentimento (chave:{" "}
              <code style={{ color: "#e4e4e7" }}>glab_privacy_consent</code>). Nenhum cookie de
              rastreamento de terceiros e instalado sem seu consentimento previo.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#fff" }}>
              8. Seguranca
            </h2>
            <p>
              O trafego entre seu navegador e o site e protegido por TLS (HTTPS). O banco de dados
              e acessado exclusivamente por chaves de servico com escopo restrito. Dados pessoais
              dos compradores nao sao armazenados no site.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#fff" }}>
              9. Alteracoes nesta politica
            </h2>
            <p>
              Esta politica pode ser atualizada para refletir mudancas operacionais ou legais. A
              data de "Ultima atualizacao" no topo da pagina indica a versao vigente. Alteracoes
              relevantes serao comunicadas no proprio site.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
