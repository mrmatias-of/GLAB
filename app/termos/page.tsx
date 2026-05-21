import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso — G•Lab Cursos",
  description: "Termos e condições de uso da plataforma G•Lab Cursos",
}

export default function TermosPage() {
  return (
    <main className="min-h-screen px-6 py-20" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="section-title mb-8">Termos de Uso</h1>
        
        <div className="prose prose-invert max-w-none space-y-6" style={{ color: '#a1a1aa' }}>
          <p className="text-sm leading-relaxed">
            Última atualização: Janeiro de 2026
          </p>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Aceitação dos Termos</h2>
            <p className="text-sm leading-relaxed">
              Ao acessar e utilizar a plataforma G•Lab Cursos, você concorda com estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Descrição dos Serviços</h2>
            <p className="text-sm leading-relaxed">
              A G•Lab Cursos oferece conteúdo educacional digital na área de manutenção de dispositivos eletrônicos, 
              incluindo guias técnicos, vídeos e materiais de apoio para profissionais de assistência técnica.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Licença de Uso</h2>
            <p className="text-sm leading-relaxed">
              Ao adquirir um curso, você recebe uma licença pessoal, intransferível e não exclusiva para acessar 
              o conteúdo. É proibida a reprodução, distribuição ou compartilhamento do material com terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Conta do Usuário</h2>
            <p className="text-sm leading-relaxed">
              Você é responsável por manter a confidencialidade de suas credenciais de acesso. 
              Qualquer atividade realizada em sua conta é de sua responsabilidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Propriedade Intelectual</h2>
            <p className="text-sm leading-relaxed">
              Todo o conteúdo disponibilizado na plataforma, incluindo textos, vídeos, imagens e materiais didáticos, 
              é de propriedade exclusiva da G•Lab Cursos e está protegido por leis de direitos autorais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Modificações</h2>
            <p className="text-sm leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              Alterações significativas serão comunicadas por e-mail ou através da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Contato</h2>
            <p className="text-sm leading-relaxed">
              Para dúvidas sobre estes termos, entre em contato através do e-mail: contato@glabcursos.com.br
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
