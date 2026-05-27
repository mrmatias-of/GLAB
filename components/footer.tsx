"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  MapPin, Mail, Clock, Headphones, CheckCircle,
  LayoutGrid, Wrench, Users, Shield, Settings, Zap,
  Cpu, BarChart3, Target, FileText, GraduationCap, Scale
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
    <footer className="relative" style={{ backgroundColor: '#050510' }}>
      {/* Top decorative line */}
      <div className="h-px w-full" style={{ 
        background: 'linear-gradient(90deg, transparent, rgba(0,212,200,0.5) 20%, rgba(0,212,200,0.8) 50%, rgba(0,212,200,0.5) 80%, transparent)'
      }} />
      
      {/* Circuit pattern decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
        <div className="flex justify-center gap-1">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-cyan-500/50" />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          
          {/* Column 1 - Logo & Brand */}
          <div className="space-y-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
              <div className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
                <Cpu size={22} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">G•Lab Cursos</h3>
                <p className="text-[10px] text-cyan-400 font-medium tracking-widest">GUIAS TÉCNICOS</p>
              </div>
            </Link>
            
            {/* Description */}
            <p className="text-sm text-white/50 leading-relaxed">
              Guias técnicos para assistência mobile, diagnóstico e profissionalização da bancada.<br />
              Conteúdo prático para quem quer começar ou evoluir na assistência técnica.
            </p>
            
            {/* Trust badges */}
            <div className="flex gap-3 pt-2">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center">
                  <Shield size={18} className="text-cyan-400" />
                </div>
                <span className="text-[8px] text-white/40 text-center font-medium leading-tight">QUALIDADE<br/>GARANTIDA</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center">
                  <Settings size={18} className="text-cyan-400" />
                </div>
                <span className="text-[8px] text-white/40 text-center font-medium leading-tight">SUPORTE<br/>ESPECIALIZADO</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center">
                  <Zap size={18} className="text-cyan-400" />
                </div>
                <span className="text-[8px] text-white/40 text-center font-medium leading-tight">ATENDIMENTO<br/>RÁPIDO</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Navegação */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
                <LayoutGrid size={12} className="text-cyan-400" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide">NAVEGAÇÃO</h4>
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
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-cyan-400 transition-colors group"
                  >
                    <span className="text-cyan-500/50 group-hover:text-cyan-400">▸</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Serviços/Cursos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
                <Wrench size={12} className="text-cyan-400" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide">CURSOS</h4>
            </div>
            <ul className="space-y-2.5">
              {cursosFooter.map((item) => (
                <li key={item.label}>
                  <Link
                    href={getCursoHref(item.label)}
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-cyan-400 transition-colors group"
                  >
                    <item.icon size={12} className="text-cyan-500/50 group-hover:text-cyan-400" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
                <Scale size={12} className="text-cyan-400" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide">LEGAL</h4>
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacidade"
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-cyan-400 transition-colors group"
                >
                  <span className="text-cyan-500/50 group-hover:text-cyan-400">▸</span>
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-cyan-400 transition-colors group"
                >
                  <span className="text-cyan-500/50 group-hover:text-cyan-400">▸</span>
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Contato & Redes Sociais */}
          <div className="space-y-5">
            {/* Contato */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
                  <Users size={12} className="text-cyan-400" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-wide">CONTATO</h4>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-white/50">Paulínia, SP<br/>Brasil</span>
                </li>
                <li>
                  <a href="mailto:contato@glabcursos.com.br" className="flex items-center gap-2 text-xs text-white/50 hover:text-cyan-400 transition-colors">
                    <Mail size={14} className="text-cyan-400 shrink-0" />
                    contato@glabcursos.com.br
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Clock size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-white/50">Seg a Sex: 08h às 18h<br/>Sábado: 08h às 13h</span>
                </li>
              </ul>
            </div>

            {/* Redes Sociais */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-xs font-bold text-white/70 tracking-wide">SIGA-NOS</h4>
              </div>
              {/* Apenas WhatsApp ativo — perfis de Facebook, Instagram e YouTube
                  serão adicionados quando as URLs reais forem fornecidas */}
              <div className="flex gap-2">
                <a
                  href="https://wa.me/5519989398294?text=Ol%C3%A1%21+Vim+pelo+site+da+G%E2%80%A2Lab+Cursos+e+tenho+uma+d%C3%BAvida+sobre+os+guias."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp G•Lab Cursos"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            {/* Help card */}
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
                  <Headphones size={14} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Precisa de ajuda?</p>
                  <p className="text-[10px] text-white/50">Fale com nossa equipe!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-cyan-400" />
              <span className="text-xs font-medium text-white/50 tracking-widest">TECNOLOGIA. PRECISÃO. CONFIANÇA.</span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-white/30">
                &copy; {new Date().getFullYear()} G•Lab Cursos. Todos os direitos reservados.
              </p>
              <button
                onClick={reset}
                className="text-xs text-white/30 hover:text-cyan-400 transition-colors underline underline-offset-2"
                type="button"
              >
                Preferências de privacidade
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative corners */}
      <div className="absolute bottom-0 left-6 w-8 h-8 border-l-2 border-b-2 border-cyan-500/20 rounded-bl-lg" />
      <div className="absolute bottom-0 right-6 w-8 h-8 border-r-2 border-b-2 border-cyan-500/20 rounded-br-lg" />
    </footer>
  )
}
