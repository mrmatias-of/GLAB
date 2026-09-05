"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Instagram, Mail, MapPin } from "lucide-react"
import { usePrivacyConsent } from "@/hooks/use-privacy-consent"

export default function Footer() {
  const { reset } = usePrivacyConsent()
  return <footer className="border-t border-white/10 bg-[#03050c] px-5 md:px-8"><div className="mx-auto max-w-7xl py-16 md:py-20">
    <div className="grid gap-12 lg:grid-cols-[1.4fr_.6fr_.6fr_.8fr]">
      <div><Link href="/" className="inline-flex"><Image src="/logo-glab-surreal.png" alt="G-LAB" width={84} height={84} className="h-16 w-16 object-contain"/></Link><p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">Formação técnica para quem quer diagnosticar melhor, executar com precisão e crescer na assistência mobile.</p><div className="mt-6 flex gap-3"><a href="https://instagram.com/_gjuliao" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 hover:border-blue-400 hover:text-white"><Instagram size={17}/></a><a href="mailto:contato@glabcursos.com.br" aria-label="E-mail" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 hover:border-blue-400 hover:text-white"><Mail size={17}/></a></div></div>
      <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/40">Navegação</p><nav className="mt-5 space-y-3">{[['Home','/'],['Cursos','/cursos'],['Contato','/contato']].map(([n,h])=><Link key={n} href={h} className="block text-sm text-slate-400 hover:text-white">{n}</Link>)}</nav></div>
      <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/40">Legal</p><nav className="mt-5 space-y-3"><Link href="/privacidade" className="block text-sm text-slate-400 hover:text-white">Privacidade</Link><Link href="/termos" className="block text-sm text-slate-400 hover:text-white">Termos de uso</Link><button onClick={reset} className="text-left text-sm text-slate-400 hover:text-white">Preferências</button></nav></div>
      <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/40">Fale com a G·Lab</p><a href="mailto:contato@glabcursos.com.br" className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.035] p-5 text-sm text-white hover:border-blue-400/50"><span>contato@glabcursos.com.br</span><ArrowUpRight size={17}/></a><p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><MapPin size={14}/> Paulínia, SP · Brasil</p></div>
    </div><div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-[10px] uppercase tracking-[.16em] text-slate-600 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} G·Lab Cursos</p><p>Tecnologia · Precisão · Confiança</p></div>
  </div></footer>
}

