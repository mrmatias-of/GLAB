"use client"

import Link from "next/link"
import {
  MapPin, Mail, Clock, Headphones, CheckCircle,
  LayoutGrid, Wrench, Users, Shield, Settings, Zap,
  Cpu, BarChart3, Target, FileText, GraduationCap, Scale, Instagram
} from "lucide-react"
import { usePrivacyConsent } from "@/hooks/use-privacy-consent"

type CursoItem = {
  label: string
  icon: typeof Target
}

const cursosFooter: CursoItem[] = [
  { label: 'Troca de Tela', icon: Target },
  { label: 'Troca de Bateria', icon: BarChart3 },
  { label: 'Conectores e Carga', icon: Zap },
  { label: 'Curto em Placa', icon: Cpu },
  { label: 'Software de Celular', icon: FileText },
]

// Mapeamento de nomes para slugs corretos do Supabase
const cursoSlugsMap: Record<string, string> = {
  'troca de tela': 'guia-troca-de-tela',
  'troca de bateria': 'guia-troca-de-bateria',
  'conectores e carga': 'guia-conectores-carga',
  'curto em placa': 'guia-curto-em-placa',
  'software de celular': 'guia-software-celular',
}

export default function Footer() {
  const { reset } = usePrivacyConsent()

  const getCursoHref = (label: string): string => {
    const slug = cursoSlugsMap[label.toLowerCase()]
    return slug ? `/cursos/${slug}` : '/cursos'
  }
  
  return (
    <footer className="relative bg-white">
      {/* Top border */}
      <div className="h-px w-full bg-gray-200" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          
          {/* Column 1 - Logo & Brand */}
          <div className="space-y-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
              <div className="w-10 h-10 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-center">
                <Cpu size={22} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">G•Lab Cursos</h3>
                <p className="text-[10px] text-blue-600 font-medium tracking-widest">GUIAS TÉCNICOS</p>
              </div>
            </Link>
            
            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              Guias técnicos para assistência mobile, diagnóstico e profissionalização da bancada.<br />
              Conteúdo prático para quem quer começar ou evoluir na assistência técnica.
            </p>
            
            {/* Trust badges */}
            <div className="flex gap-3 pt-2">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-center">
                  <Shield size={18} className="text-blue-600" />
                </div>
                <span className="text-[8px] text-gray-600 text-center font-medium leading-tight">CONTEÚDO<br/>PRÁTICO</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-center">
                  <Settings size={18} className="text-blue-600" />
                </div>
                <span className="text-[8px] text-gray-600 text-center font-medium leading-tight">ACESSO<br/>DIGITAL</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-center">
                  <Zap size={18} className="text-blue-600" />
                </div>
                <span className="text-[8px] text-gray-600 text-center font-medium leading-tight">PAGAMENTO<br/>SEGURO</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Navegação */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded border border-blue-200 bg-blue-50 flex items-center justify-center">
                <LayoutGrid size={12} className="text-blue-600" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 tracking-wide">NAVEGAÇÃO</h4>
            </div>
            <ul className="space-y-2.5">
              {[
                { label: 'Página Inicial', href: '/' },
                { label: 'Cursos', href: '/cursos' },
                { label: 'Contato', href: '/contato' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <span className="text-gray-400 group-hover:text-blue-600">▸</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Cursos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded border border-blue-200 bg-blue-50 flex items-center justify-center">
                <Wrench size={12} className="text-blue-600" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 tracking-wide">CURSOS</h4>
            </div>
            <ul className="space-y-2.5">
              {cursosFooter.map((item) => (
                <li key={item.label}>
                  <Link
                    href={getCursoHref(item.label)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <item.icon size={12} className="text-gray-400 group-hover:text-blue-600" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded border border-blue-200 bg-blue-50 flex items-center justify-center">
                <Scale size={12} className="text-blue-600" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 tracking-wide">LEGAL</h4>
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacidade"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <span className="text-gray-400 group-hover:text-blue-600">▸</span>
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <span className="text-gray-400 group-hover:text-blue-600">▸</span>
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Contato & Redes */}
          <div className="space-y-5">
            {/* Contato */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded border border-blue-200 bg-blue-50 flex items-center justify-center">
                  <Users size={12} className="text-blue-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 tracking-wide">CONTATO</h4>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-blue-600 mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-600">Paulínia, SP<br/>Brasil</span>
                </li>
                <li>
                  <a href="mailto:contato@glabcursos.com.br" className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail size={14} className="text-blue-600 shrink-0" />
                    contato@glabcursos.com.br
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Clock size={14} className="text-blue-600 mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-600">Seg a Sex: 08h às 18h<br/>Sábado: 08h às 13h</span>
                </li>
              </ul>
            </div>

            {/* Redes Sociais */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-xs font-bold text-gray-900 tracking-wide">SIGA-NOS</h4>
              </div>
              <div className="flex gap-2">
                {/* WhatsApp removed - was causing rendering issues */}
                <a
                  href="https://instagram.com/_gjuliao"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @_gjuliao"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-110 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"
                >
                  <Instagram size={18} className="text-white" />
                </a>
              </div>
            </div>

            {/* Help card */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg border border-blue-200 bg-blue-100 flex items-center justify-center">
                  <Headphones size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Precisa de ajuda?</p>
                  <p className="text-[10px] text-gray-600">Fale com nossa equipe!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-600 tracking-widest">TECNOLOGIA. PRECISÃO. CONFIANÇA.</span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} G•Lab Cursos. Todos os direitos reservados.
              </p>
              <button
                onClick={reset}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors underline underline-offset-2"
                type="button"
              >
                Preferências de privacidade
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
