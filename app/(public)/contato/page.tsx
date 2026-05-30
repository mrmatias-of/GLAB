import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato — G-Lab',
  description: 'Entre em contato conosco para dúvidas, sugestões ou informações sobre nossos cursos de manutenção de celulares.',
}

import ContactForm from '@/components/contact-form'

export default function ContatoPage() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-4" style={{ color: '#fff' }}>
            Entre em contato
          </h1>
          <p className="text-lg" style={{ color: '#71717a' }}>
            Tem dúvidas ou sugestões? Estamos aqui para ajudar. Envie sua mensagem e responderemos em breve.
          </p>
        </div>

        {/* Bloco pré-venda */}
        <div className="mb-12 p-6 rounded-xl border" style={{ 
          backgroundColor: '#0f0f1a', 
          borderColor: '#00D4C8',
          borderWidth: '2px'
        }}>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md" style={{ backgroundColor: '#00D4C8' }}>
                <svg className="h-6 w-6" fill="none" stroke="#050510" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2" style={{ color: '#fff' }}>
                Pronto para começar sua evolução?
              </h2>
              <p style={{ color: '#a1a1aa' }} className="text-sm mb-4">
                Explore nossos guias técnicos com conteúdo prático de assistência mobile, diagnóstico avançado e gestão de bancada.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a 
                  href="/cursos"
                  className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                  style={{ 
                    backgroundColor: '#00D4C8',
                    color: '#050510'
                  }}
                >
                  Ver Catálogo
                </a>
                <a 
                  href="https://wa.me/5519989398294?text=Ol%C3%A1%21+Vim+pela+p%C3%A1gina+de+contato+e+gostaria+de+tirar+uma+d%C3%BAvida+sobre+os+guias."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                  style={{ 
                    backgroundColor: '#25D366',
                    color: '#fff'
                  }}
                >
                  Tirar Dúvida no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}
