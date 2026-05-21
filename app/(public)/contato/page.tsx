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

        <ContactForm />
      </div>
    </section>
  )
}
