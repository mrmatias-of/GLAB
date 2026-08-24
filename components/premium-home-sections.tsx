import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BatteryCharging, BookOpenCheck, Check, CircuitBoard, Cpu, Gauge, Headphones, LockKeyhole, RefreshCw, ShieldCheck, Smartphone, Sparkles, Wrench } from "lucide-react"

const cards = [
  { title: "Troca de tela", text: "Execução limpa, desmontagem segura e acabamento profissional.", icon: Smartphone, image: "/images/course-troca-tela-v2.png", href: "/cursos/guia-troca-de-tela", fit: "cover" },
  { title: "Diagnóstico de placa", text: "Encontre a causa antes de trocar peças ou perder tempo.", icon: CircuitBoard, image: "/hero-tech-pcb.jpg", href: "/cursos/guia-curto-em-placa", fit: "cover" },
  { title: "Bateria e carga", text: "Protocolos confiáveis para falhas de autonomia e alimentação.", icon: BatteryCharging, image: "/thumbnail_combo_iniciante_mobile_v2.jpg", href: "/cursos/guia-troca-de-bateria", fit: "contain" },
]

export default function PremiumHomeSections() {
  return <>
    <section className="border-y border-white/10 bg-white/[.025]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-5 md:grid-cols-4 md:px-8">
        {[['+10','anos de experiência'],['16','formações técnicas'],['4','trilhas de evolução'],['G·LAB','autoria identificada']].map(([v,l]) => <div key={l} className="px-4 py-8 text-center md:py-10"><p className="text-3xl font-black tracking-tight text-white md:text-4xl">{v}</p><p className="mt-2 text-[10px] uppercase tracking-[.2em] text-slate-500">{l}</p></div>)}
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
            <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[#070a15]"><Image src={card.image} alt={card.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className={`${card.fit === "contain" ? "object-contain p-2" : "object-cover object-center"} transition duration-700 group-hover:scale-[1.03]`} /><div className="absolute inset-0 bg-gradient-to-t from-[#070914]/80 via-transparent to-transparent" /><span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.18em] text-white backdrop-blur">0{i+1} · Formação</span></div>
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

    <section className="relative px-5 py-24 md:px-8 md:py-32">
      <div className="absolute left-0 top-24 h-96 w-96 rounded-full bg-cyan-600/10 blur-[150px]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#080b17] p-2 shadow-[0_35px_100px_rgba(0,0,0,.45)]">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[26px]"><Image src="/images/gj/guilherme-juliao.jpg" alt="Mapa da formação técnica G·LAB, por Guilherme Julião" fill sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" /></div>
          <div className="grid gap-3 p-4 sm:grid-cols-3"><div className="rounded-xl border border-white/10 bg-white/[.035] p-4"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-slate-500">Responsável</p><p className="mt-2 text-sm font-bold text-white">Guilherme Julião</p></div><div className="rounded-xl border border-white/10 bg-white/[.035] p-4"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-slate-500">Especialidade</p><p className="mt-2 text-sm font-bold text-white">Assistência técnica</p></div><div className="rounded-xl border border-white/10 bg-white/[.035] p-4"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-slate-500">Base</p><p className="mt-2 text-sm font-bold text-white">Paulínia · SP</p></div></div>
        </div>
        <div><p className="premium-kicker">Autoria e transparência</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-white md:text-6xl">Existe técnica por trás de cada formação.</h2><p className="mt-6 max-w-xl text-base leading-7 text-slate-400">A G·LAB apresenta quem está por trás do conteúdo, como o aprendizado é organizado e o que será entregue. Sem promessas vagas: você conhece a trilha antes de decidir.</p>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">{[
            {i:BookOpenCheck,t:'Conteúdo estruturado',d:'Módulos e tópicos visíveis em cada curso.'},
            {i:RefreshCw,t:'Evolução contínua',d:'Biblioteca preparada para novos procedimentos.'},
            {i:Headphones,t:'Canal de atendimento',d:'Contato direto para dúvidas antes da compra.'},
            {i:LockKeyhole,t:'Transparência no checkout',d:'Pagamento somente em ambiente oficial e seguro.'}
          ].map(x=><div key={x.t} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-5"><x.i size={20} className="mt-0.5 shrink-0 text-cyan-300"/><div><h3 className="text-sm font-bold text-white">{x.t}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{x.d}</p></div></div>)}</div>
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[.06] p-4 text-xs text-emerald-100"><ShieldCheck size={18} className="shrink-0 text-emerald-400" /> Dados institucionais, termos de uso e política de privacidade disponíveis no site.</div>
        </div>
      </div>
    </section>

    <section className="px-5 pb-24 md:px-8 md:pb-32"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-blue-400/20 bg-gradient-to-br from-blue-700 via-blue-600 to-violet-700 px-7 py-16 text-center shadow-[0_30px_100px_rgba(37,99,235,.25)] md:px-16 md:py-24"><div className="absolute inset-0 premium-grid opacity-20"/><div className="relative"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-blue-100">Seu próximo nível começa aqui</p><h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-[-.05em] text-white md:text-7xl">Pare de improvisar.<br/>Comece a dominar.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-blue-100">Acesse conteúdos criados para transformar sua forma de diagnosticar, executar e entregar.</p><Link href="/cursos" className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-blue-700 shadow-xl transition hover:-translate-y-1">Conhecer todos os cursos <ArrowRight size={18}/></Link></div></div></section>
  </>
}
