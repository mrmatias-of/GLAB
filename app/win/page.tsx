import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Download, Github, ShieldCheck, Sparkles, Terminal, Wrench, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "GL WinTool — Operação Windows com método | G·LAB",
  description: "Uma central profissional para preparar, ajustar e manter ambientes Windows.",
}

const features = [
  { icon: Terminal, label: "Instalação", title: "Tudo pronto para começar", text: "Catálogo de aplicativos, busca inteligente e instalação por WinGet em poucos passos." },
  { icon: Wrench, label: "Manutenção", title: "Diagnóstico sem tentativa e erro", text: "Rotinas para rede, temporários, SFC, DISM, Windows Update e relatório de saúde." },
  { icon: ShieldCheck, label: "Segurança", title: "Ações importantes com controle", text: "Confirmações, backups locais, logs visíveis e reversão quando o procedimento permite." },
]

const modules = ["Instalar aplicativos", "Ajustar o Windows", "Reparar componentes", "Gerenciar AppX", "Preparar Windows 11", "Atualizar e manter"]

export default function WinToolPage() {
  return <main className="min-h-screen overflow-hidden bg-[#06080d] text-white">
    <section className="relative border-b border-white/10 px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(34,211,238,.22),transparent_30%),radial-gradient(circle_at_10%_85%,rgba(79,70,229,.18),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-slate-500 hover:text-white">G·LAB <ArrowRight size={13}/> Ferramentas</Link>
        <div className="mt-14 grid gap-14 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[.2em] text-cyan-200"><Sparkles size={14}/>Produto G·LAB · Windows 10/11</div>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[.9] tracking-[-.07em] md:text-7xl">O Windows da sua bancada, sob controle.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">O GL WinTool transforma rotinas demoradas em uma operação visual, guiada e segura — feita para técnicos, laboratórios e quem cuida de muitas máquinas.</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href="https://github.com/mrmatias-of/GLWinTool" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-xl bg-cyan-300 px-6 py-4 text-sm font-black text-[#061014] transition hover:-translate-y-1 hover:bg-cyan-200"><Download size={17}/>Baixar gratuitamente <ArrowRight size={16}/></a><a href="https://github.com/mrmatias-of/GLWinTool" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[.04] px-6 py-4 text-sm font-black text-white hover:border-cyan-300/35"><Github size={17}/>Ver código</a></div>
            <div className="mt-5 flex flex-wrap gap-5 text-xs font-bold text-slate-500"><span>v0.5.7</span><span>•</span><span>Interface pt-BR</span><span>•</span><span>Código aberto</span></div>
          </div>
          <div className="relative"><div className="absolute -inset-6 rounded-[38px] bg-cyan-400/10 blur-3xl"/><div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#0b111b] p-2 shadow-2xl shadow-black/60"><div className="overflow-hidden rounded-[22px] border border-white/10 bg-black"><img src="https://raw.githubusercontent.com/mrmatias-of/GLWinTool/main/assets/readme/gl-win-tool-banner.png" alt="Interface real do GL WinTool" className="block h-auto w-full object-cover" /><div className="grid grid-cols-3 border-t border-white/10 bg-[#0b111b]"><div className="p-4"><p className="text-xl font-black text-cyan-200">232</p><p className="mt-1 text-[10px] font-black uppercase tracking-[.14em] text-slate-500">apps</p></div><div className="border-x border-white/10 p-4"><p className="text-xl font-black text-cyan-200">6</p><p className="mt-1 text-[10px] font-black uppercase tracking-[.14em] text-slate-500">módulos</p></div><div className="p-4"><p className="text-xl font-black text-cyan-200">0.5.7</p><p className="mt-1 text-[10px] font-black uppercase tracking-[.14em] text-slate-500">versão</p></div></div></div></div></div>>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28"><div className="max-w-2xl"><p className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-300">Uma ferramenta, seis frentes</p><h2 className="mt-4 text-4xl font-black tracking-[-.05em] md:text-6xl">Menos improviso. Mais padrão.</h2></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{features.map(({icon:Icon,label,title,text})=><article key={label} className="rounded-3xl border border-white/10 bg-white/[.03] p-7 transition hover:-translate-y-1 hover:border-cyan-300/30"><div className="flex items-center justify-between"><Icon size={23} className="text-cyan-300"/><span className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500">{label}</span></div><h3 className="mt-8 text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{text}</p></article>)}</div></section>
    <section className="border-y border-white/10 bg-[#090d15] px-5 py-20 md:px-8 md:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-300">Dentro da ferramenta</p><h2 className="mt-4 text-4xl font-black tracking-[-.05em] md:text-6xl">Fluxos pensados para a rotina real.</h2><p className="mt-5 text-sm leading-7 text-slate-400">O GL WinTool organiza tarefas técnicas em módulos claros para reduzir retrabalho e acelerar a bancada.</p></div><div className="grid gap-3 sm:grid-cols-2">{modules.map((item,i)=><div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-5"><span className="text-xs font-black text-cyan-300">0{i+1}</span><span className="font-bold text-slate-200">{item}</span></div>)}</div></div></section>
    <section className="px-5 py-20 md:px-8 md:py-28"><div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[30px] border border-cyan-300/20 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,.18),transparent_40%),#0b1627] p-8 md:flex-row md:items-center md:justify-between md:p-12"><div><p className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-200">Pronto para testar?</p><h2 className="mt-3 text-3xl font-black md:text-5xl">Baixe, abra e coloque sua bancada em ordem.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">O repositório oficial reúne o código, instruções e versões disponíveis.</p></div><a href="https://github.com/mrmatias-of/GLWinTool" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-black text-[#0b1627]"><Github size={17}/>Abrir repositório</a></div></section>
  </main>
}
