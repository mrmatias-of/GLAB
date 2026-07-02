import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function HomeFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 inline-block">
              G•Lab
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plataforma de conhecimento técnico para profissionais de reparo eletrônico.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-slate-50 font-semibold mb-4">Produto</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#courses" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Plataforma
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-slate-50 font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-slate-50 font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:contato@glab.com" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  contato@glab.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                <a href="tel:+5511999999999" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  +55 (11) 9 9999-9999
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">
                  São Paulo, SP<br />Brasil
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/50 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-slate-500 text-sm">
              © 2024 G•Lab. Todos os direitos reservados.
            </p>

            {/* Legal Links */}
            <div className="flex gap-6">
              <Link href="/privacidade" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
                Privacidade
              </Link>
              <Link href="/termos" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
                Termos de Uso
              </Link>
              <Link href="/cookies" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
