import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade — G•Lab Cursos",
  description: "Política de privacidade e proteção de dados da G•Lab Cursos",
}

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen px-6 py-20" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="section-title mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-invert max-w-none space-y-6" style={{ color: '#a1a1aa' }}>
          <p className="text-sm leading-relaxed">
            Última atualização: Janeiro de 2026
          </p>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Coleta de Dados</h2>
            <p className="text-sm leading-relaxed">
              Coletamos informações pessoais que você nos fornece diretamente, como nome, e-mail e telefone 
              ao criar uma conta ou realizar uma compra. Também coletamos dados de navegação automaticamente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Uso das Informações</h2>
            <p className="text-sm leading-relaxed">
              Utilizamos seus dados para: processar compras, fornecer acesso aos cursos, 
              enviar comunicações sobre atualizações e novos conteúdos, e melhorar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Compartilhamento de Dados</h2>
            <p className="text-sm leading-relaxed">
              Não vendemos ou alugamos suas informações pessoais. Podemos compartilhar dados com 
              prestadores de serviços essenciais (processadores de pagamento, hospedagem) que seguem 
              padrões adequados de segurança.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Segurança</h2>
            <p className="text-sm leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados 
              contra acesso não autorizado, alteração ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Cookies</h2>
            <p className="text-sm leading-relaxed">
              Utilizamos cookies para melhorar sua experiência de navegação, lembrar preferências 
              e analisar o uso da plataforma. Você pode configurar seu navegador para recusar cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Seus Direitos (LGPD)</h2>
            <p className="text-sm leading-relaxed">
              Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar seus dados, 
              corrigi-los, solicitar exclusão, e revogar consentimento. Para exercer esses direitos, 
              entre em contato conosco.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Contato</h2>
            <p className="text-sm leading-relaxed">
              Para questões sobre privacidade: contato@glabcursos.com.br
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
