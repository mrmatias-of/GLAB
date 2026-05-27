"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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

        <h1 className="text-3xl font-bold mb-8" style={{ color: '#fff' }}>
          Termos de Uso
        </h1>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>1. Aceitacao dos Termos</h2>
            <p>
              Ao acessar e utilizar o G-Lab, voce concorda com estes termos de uso. Se voce nao 
              concordar com algum termo, nao utilize nossos servicos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>2. Descricao do Servico</h2>
            <p>
              O G-Lab e uma plataforma de cursos online focada em manutencao de celulares. 
              Oferecemos conteudo educacional atraves de guias mestres, videos e materiais de apoio.
              Com mais de 10 anos de experiencia no mercado, nosso objetivo e capacitar tecnicos 
              para atuar com excelencia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>3. Conta do Usuario</h2>
            <p>
              O acesso aos cursos e realizado atraves da plataforma Kirvano apos a compra. 
              Voce e responsavel por manter a confidencialidade dos seus dados de acesso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>4. Uso do Conteudo</h2>
            <p>Todo o conteudo disponibilizado e protegido por direitos autorais. Voce pode:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Acessar o conteudo para uso pessoal e educacional</li>
              <li>Assistir aos videos quantas vezes quiser</li>
              <li>Fazer anotacoes para estudo pessoal</li>
            </ul>
            <p className="mt-3">Voce NAO pode:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Compartilhar seu acesso com terceiros</li>
              <li>Copiar, distribuir ou revender o conteudo</li>
              <li>Gravar ou reproduzir os videos</li>
              <li>Utilizar o conteudo para fins comerciais sem autorizacao</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>5. Pagamentos</h2>
            <p>
              Todos os pagamentos sao processados pela Kirvano. Ao realizar uma compra, voce 
              concorda com os termos de pagamento e politica de reembolso da plataforma.
              O prazo para solicitar reembolso e de 7 dias apos a compra, conforme o Codigo 
              de Defesa do Consumidor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>6. Garantia de Satisfacao</h2>
            <p>
              Oferecemos garantia de 7 dias. Se o curso nao atender suas expectativas, 
              solicite o reembolso atraves da plataforma Kirvano dentro deste prazo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>7. Modificacoes</h2>
            <p>
              Reservamos o direito de modificar estes termos a qualquer momento. Alteracoes 
              significativas serao comunicadas por email ou atraves do site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>8. Contato</h2>
            <p>
              Duvidas sobre os termos? Entre em contato atraves da nossa{" "}
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
