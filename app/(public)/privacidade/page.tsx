"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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

        <h1 className="text-3xl font-bold mb-8" style={{ color: '#fff' }}>
          Politica de Privacidade
        </h1>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>1. Informacoes Coletadas</h2>
            <p>
              O G-Lab coleta informacoes que voce fornece diretamente, como nome, email e telefone 
              ao preencher formularios de contato ou realizar compras. Tambem coletamos dados de 
              navegacao para melhorar sua experiencia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>2. Uso das Informacoes</h2>
            <p>Utilizamos suas informacoes para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Processar suas compras e fornecer acesso aos cursos</li>
              <li>Enviar comunicacoes sobre atualizacoes e novos conteudos</li>
              <li>Responder suas duvidas e solicitacoes de suporte</li>
              <li>Melhorar nossos servicos e experiencia do usuario</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>3. Compartilhamento de Dados</h2>
            <p>
              Nao vendemos ou compartilhamos suas informacoes pessoais com terceiros, exceto quando 
              necessario para processamento de pagamentos atraves da Kirvano ou quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>4. Seguranca</h2>
            <p>
              Implementamos medidas de seguranca para proteger suas informacoes contra acesso nao 
              autorizado, alteracao ou destruicao. Utilizamos criptografia SSL em todas as transmissoes 
              de dados sensiveis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>5. Cookies</h2>
            <p>
              Utilizamos cookies para melhorar sua experiencia de navegacao, lembrar suas preferencias 
              e analisar o trafego do site. Voce pode configurar seu navegador para recusar cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>6. Seus Direitos</h2>
            <p>Voce tem direito a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informacoes incorretas</li>
              <li>Solicitar a exclusao dos seus dados</li>
              <li>Revogar consentimento para comunicacoes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>7. Contato</h2>
            <p>
              Para questoes sobre privacidade, entre em contato atraves da nossa{" "}
              <Link href="/contato" className="underline" style={{ color: '#818cf8' }}>
                pagina de contato
              </Link>.
            </p>
          </section>

          <p className="pt-4 text-xs" style={{ color: '#52525b' }}>
            Ultima atualizacao: Janeiro de 2025
          </p>
        </div>
      </div>
    </main>
  )
}
