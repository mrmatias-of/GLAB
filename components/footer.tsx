"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  MapPin, Mail, Phone, Clock, Headphones, CheckCircle,
  LayoutGrid, Wrench, Users, Shield, Settings, Zap,
  Cpu, BarChart3, Target, FileText, GraduationCap
} from "lucide-react"

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

// Mapeamento de nomes para slugs (hardcoded como fallback)
const cursoSlugsMap: Record<string, string> = {
  'troca de tela': 'troca-de-tela',
  'troca de bateria': 'troca-de-bateria',
  'conectores e carga': 'conectores-e-carga',
  'curto em placa': 'curto-em-placa',
  'software de celular': 'software-de-celular',
}

export default function Footer() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          
          {/* Column 1 - Logo & Brand */}
          <div className="space-y-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
              <div className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
                <Cpu size={22} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">G-LAB</h3>
                <p className="text-[10px] text-cyan-400 font-medium tracking-widest">ASSISTÊNCIA TÉCNICA</p>
              </div>
            </Link>
            
            {/* Description */}
            <p className="text-sm text-white/50 leading-relaxed">
              Soluções em assistência técnica<br />
              com qualidade, precisão e confiança.<br />
              <span className="text-cyan-400">Seu equipamento, nossa prioridade.</span>
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
                { label: 'Sobre Nós', href: '/sobre' },
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

          {/* Column 4 - Contato & Redes Sociais */}
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
                <li>
                  <a href="https://wa.me/5519989398294" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white/50 hover:text-cyan-400 transition-colors">
                    <Phone size={14} className="text-cyan-400 shrink-0" />
                    (19) 98939-8294
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
              <div className="flex gap-2">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: '#1877F2' }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: '#FF0000' }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a 
                  href="https://wa.me/5519989398294" 
                  target="_blank" 
                  rel="noopener noreferrer"
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
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} G-LAB Cursos. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom decorative corners */}
      <div className="absolute bottom-0 left-6 w-8 h-8 border-l-2 border-b-2 border-cyan-500/20 rounded-bl-lg" />
      <div className="absolute bottom-0 right-6 w-8 h-8 border-r-2 border-b-2 border-cyan-500/20 rounded-br-lg" />
    </footer>
  )
}
