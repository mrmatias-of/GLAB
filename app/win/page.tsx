import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Download, ShieldCheck, Sparkles, Wrench, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "GL WinTool | G·LAB",
  description: "Ferramenta profissional para preparar, ajustar e manter ambientes Windows.",
}

const recursos = [
  ["Instalação rápida", "Catálogo organizado de aplicativos com busca e presets."],
  ["Manutenção segura", "DISM, SFC, rede, temporários, saúde e restauração."],
  ["Ajustes Windows", "Perfis mínimo, padrão e avançado com confirmação."],
  ["Operação profissional", "Logs, progresso visual e backups preventivos."],
]

export default function WinToolPage() {
  return <main className="min-h-screen bg-[#07090d] text-white">
    <section className="relative overflow-hidden border-b border-white/10 px-5 py-20 md:px-8 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(34,211,238,.2),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(99,102,241,.18),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.72fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-cyan-200"><Sparkles size={14}/>Ferramenta G·LAB · v0.5.6</span>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[.92] tracking-[-.06em] md:text-7xl">Seu Windows, preparado para trabalhar.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">O GL WinTool reúne instalação, manutenção e ajustes essenciais em uma experiência visual, rápida e segura para técnicos e profissionais.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="https://github.com/mrmatias-of/GLWinTool" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-xl bg-cyan-300 px-6 py-4 text-sm font-black text-[#061014] transition hover:-translate-y-1 hover:bg-cyan-200"><Download size={17}/>Baixar no GitHub <ArrowRight size={16}/></a>
            <Link href="/cursos" className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[.05] px-6 py-4 text-sm font-black text-white hover:bg-white/10">Conhecer os cursos</Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500">Código aberto · Windows 10 e 11 · Interface em português</p>
        </div>
        <div className="rounded-3xl border border-cyan-300/20 bg-white/[.04] p-6 shadow-2xl shadow-cyan-950/30">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-200"><Wrench size={21}/></div><div><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-200">GL WinTool</p><p className="mt-1 text-sm text-zinc-400">Central de operação Windows</p></div></div>
          <div className="mt-7 grid gap-3">{recursos.map(([title,text])=><div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="font-black">{title}</p><p className="mt-1 text-sm leading-6 text-zinc-400">{text}</p></div>)}</div>
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-3 md:px-8 md:py-24">
      {[[ShieldCheck,"Segurança operacional","Confirmações, backups e logs antes de ações sensíveis."],[Zap,"Fluxo mais rápido","Rotinas de bancada e pós-formatação em uma interface única."],[Wrench,"Feito para técnicos","Português, atalhos claros e foco na operação real."]].map(([Icon,title,text])=><article key={String(title)} className="rounded-3xl border border-white/10 bg-white/[.03] p-7"><Icon size={23} className="text-cyan-300"/><h2 className="mt-5 text-xl font-black">{String(title)}</h2><p className="mt-3 text-sm leading-6 text-zinc-400">{String(text)}</p></article>)}
    </section>
  </main>
}
