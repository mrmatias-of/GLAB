import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BatteryCharging, Check, CircuitBoard, Cpu, Gauge, Smartphone, Sparkles, Star, Wrench } from "lucide-react"

const cards = [
  { title: "Troca de tela", text: "Execução limpa, desmontagem segura e acabamento profissional.", icon: Smartphone, image: "/thumbnail_combo_iniciante_mobile_v3.jpg", href: "/cursos/guia-troca-de-tela" },
  { title: "Diagnóstico de placa", text: "Encontre a causa antes de trocar peças ou perder tempo.", icon: CircuitBoard, image: "/hero-tech-pcb.jpg", href: "/cursos/guia-curto-em-placa" },
  { title: "Bateria e carga", text: "Protocolos confiáveis para falhas de autonomia e alimentação.", icon: BatteryCharging, image: "/thumbnail_combo_iniciante_mobile_v2.jpg", href: "/cursos/guia-troca-de-bateria" },
]

export default function PremiumHomeSections() {
  return <>
    <section className="border-y border-white/10 bg-white/[.025]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-5 md:grid-cols-4 md:px-8">
        {[['+10','anos de bancada'],['100%','foco prático'],['5','áreas essenciais'],['24/7','acesso digital']].map(([v,l]) => <div key={l} className="px-4 py-8 text-center md:py-10"><p className="text-3xl font-black tracking-tight text-white md:text-4xl">{v}</p><p className="mt-2 text-[10px] uppercase tracking-[.2em] text-slate-500">{l}</p></div>)}
      </div>
    </section>

    <section className="relative px-5 py-24 md:px-8 md:py-32" id="cursos">
      <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="premium-kicker">Biblioteca técnica</p><h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-.045em] text-white md:text-6xl">Conhecimento que vira <span className="premium-text">resultado na bancada.</span></h2></div>
          <p className="max-w-md text-sm leading-6 text-slate-400">Conteúdos desenvolvidos para você consultar, aplicar e evoluir com um caminho claro — do fundamento ao diagnóstico avançado.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {cards.map((card, i) => <Link href={card.href} key={card.title} className="group premium-course-card">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]"><Image src={card.image} alt={card.title} fill className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#070914] via-transparent to-transparent" /><span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.18em] text-white backdrop-blur">0{i+1} · Formação</span></div>
            <div className="p-6"><div className="mb-4 flex items-center justify-between"><card.icon className="text-cyan-300" size={24}/><ArrowRight size={19} className="text-white/40 transition group-hover:translate-x-1 group-hover:text-white"/></div><h3 className="text-xl font-bold text-white">{card.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p></div>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="px-5 py-24 md:px-8 md:py-32 bg-[#080b17]">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
        <div className="relative min-h-[520px] overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-600/15 to-violet-600/10 p-7 md:p-10">
          <div className="absolute inset-0 premium-grid opacity-40" />
          <div className="relative flex h-full flex-col justify-between">
            <div><p className="premium-kicker">O método G·Lab</p><h3 className="mt-5 max-w-md text-4xl font-black leading-tight tracking-[-.04em] text-white">Menos achismo.<br/>Mais processo.</h3></div>
            <div className="mt-20 space-y-3">
              {[['01','Entenda o sintoma'],['02','Siga o diagnóstico'],['03','Execute com precisão'],['04','Valide o resultado']].map(([n,t])=><div key={n} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><span className="text-xs font-black text-cyan-300">{n}</span><span className="font-semibold text-white/85">{t}</span><Check size={16} className="ml-auto text-emerald-400"/></div>)}
            </div>
          </div>
        </div>
        <div><p className="premium-kicker">Evolução estruturada</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-white md:text-6xl">Técnica é confiança repetida.</h2><p className="mt-6 max-w-xl text-base leading-7 text-slate-400">Você não precisa decorar soluções. Precisa desenvolver raciocínio técnico, dominar processos e saber exatamente o que observar em cada etapa.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[{i:Gauge,t:'Diagnóstico claro',d:'Um caminho lógico para encontrar falhas.'},{i:Wrench,t:'Aplicação imediata',d:'Procedimentos pensados para a rotina.'},{i:Cpu,t:'Visão técnica',d:'Entenda o porquê de cada decisão.'},{i:Sparkles,t:'Padrão profissional',d:'Entregue um serviço mais consistente.'}].map(x=><div key={x.t} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><x.i size={21} className="text-blue-400"/><h3 className="mt-4 font-bold text-white">{x.t}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{x.d}</p></div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl"><div className="text-center"><p className="premium-kicker">Experiência de quem aplica</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-.045em] text-white md:text-6xl">Feito para quem leva a bancada a sério.</h2></div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">{[
          ['“Passei a diagnosticar antes de abrir. Hoje trabalho com muito mais segurança e reduzi bastante o retrabalho.”','Rafael M.','Técnico · São Paulo'],
          ['“O conteúdo é direto, visual e realmente conversa com o que acontece no dia a dia da assistência.”','Leandro T.','Técnico · Curitiba'],
          ['“Comecei do zero e finalmente encontrei um caminho organizado. A evolução na prática foi muito rápida.”','Caio B.','Aluno · Goiânia']
        ].map(([q,n,r])=><article key={n} className="rounded-[24px] border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.025] p-7"><div className="flex gap-1 text-amber-300">{[1,2,3,4,5].map(s=><Star key={s} size={14} fill="currentColor"/>)}</div><p className="mt-6 text-sm leading-7 text-slate-300">{q}</p><div className="mt-7 border-t border-white/10 pt-5"><p className="font-bold text-white">{n}</p><p className="text-xs text-slate-500">{r}</p></div></article>)}</div>
      </div>
    </section>

    <section className="px-5 pb-24 md:px-8 md:pb-32"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-blue-400/20 bg-gradient-to-br from-blue-700 via-blue-600 to-violet-700 px-7 py-16 text-center shadow-[0_30px_100px_rgba(37,99,235,.25)] md:px-16 md:py-24"><div className="absolute inset-0 premium-grid opacity-20"/><div className="relative"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-blue-100">Seu próximo nível começa aqui</p><h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-[-.05em] text-white md:text-7xl">Pare de improvisar.<br/>Comece a dominar.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-blue-100">Acesse conteúdos criados para transformar sua forma de diagnosticar, executar e entregar.</p><Link href="/cursos" className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-blue-700 shadow-xl transition hover:-translate-y-1">Conhecer todos os cursos <ArrowRight size={18}/></Link></div></div></section>
  </>
}
