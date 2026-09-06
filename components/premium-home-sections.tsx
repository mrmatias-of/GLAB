import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpenCheck, Check, ChevronRight, CircuitBoard, Cpu, Gauge, Headphones, Layers3, LockKeyhole, Microscope, Radio, RefreshCw, Settings2, ShieldCheck, Smartphone, Sparkles, Wrench } from "lucide-react"

const areas = [
  { icon: Wrench, number: "01", title: "Fundamentos da bancada", text: "Eletrônica, multímetro, ferramentas, segurança ESD e triagem profissional.", image: "/images/combo/combo-iniciante.webp", href: "/cursos#fundamentos", span: "lg:col-span-7" },
  { icon: Smartphone, number: "02", title: "Reparos e periféricos", text: "Telas, baterias, conectores, câmeras, áudio, sensores e danos por líquido.", image: "/images/course-troca-tela-v2.png", href: "/cursos#reparos", span: "lg:col-span-5" },
  { icon: CircuitBoard, number: "03", title: "Diagnóstico e placa", text: "Consumo, curto, esquemas, PMIC, imagem, rede e falhas intermitentes.", image: "/images/courses/guia-diagnostico-avancado.webp", href: "/cursos#diagnostico", span: "lg:col-span-5" },
  { icon: Microscope, number: "04", title: "Microsolda e componentes", text: "SMD, trilhas, pads, BGA, conectores delicados e memórias mobile.", image: "/images/hero-microscope-lab-v2.png", href: "/cursos#microsolda", span: "lg:col-span-7" },
  { icon: Radio, number: "05", title: "Especialização Apple", text: "Panic logs, carga, Face ID, backlight e placas sanduíche de iPhone.", image: "/images/iphone.png", href: "/cursos#apple", span: "lg:col-span-7" },
  { icon: Settings2, number: "06", title: "Software e dados", text: "Android, iOS, firmware oficial, recuperação, backup e privacidade.", image: "/images/samsung.png", href: "/cursos#software", span: "lg:col-span-5" },
  { icon: Layers3, number: "07", title: "Gestão profissional", text: "Precificação, processos, estoque, atendimento, qualidade e marketing local.", image: "/images/gestao.png", href: "/cursos#gestao", span: "lg:col-span-5" },
  { icon: Gauge, number: "08", title: "PC & Performance", text: "Hardware, notebooks, Windows, estabilidade, temperatura e otimização real.", image: "/images/pc.png", href: "/cursos#performance", span: "lg:col-span-7" },
]

const featured = [
  { number: "01", tag: "Fundamentos", title: "Troca de Tela Profissional", text: "Do diagnóstico inicial ao acabamento e validação final.", image: "/images/course-troca-tela-v2.png", href: "/cursos/guia-troca-de-tela" },
  { number: "02", tag: "Avançado", title: "Diagnóstico de Placa", text: "Encontre a causa da falha antes de substituir componentes.", image: "/images/hero-microscope-lab-v2.png", href: "/cursos/guia-curto-em-placa" },
  { number: "03", tag: "Formação completa", title: "Combo Iniciante Mobile", text: "Uma rota organizada para construir sua base técnica.", image: "/images/combo/combo-iniciante.webp", href: "/cursos/combo-iniciante-mobile" },
]

export default function PremiumHomeSections() {
  return <>
    <section className="relative z-10 border-b border-white/[.08] bg-[#070914]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-white/[.08] px-5 md:grid-cols-4 md:px-8 xl:px-12">
        {[["+10", "anos de experiência"], ["48", "formações técnicas"], ["8", "trilhas especializadas"], ["01", "método de bancada"]].map(([value, label]) => <div key={label} className="px-3 py-8 text-center md:py-11"><p className="text-3xl font-black tracking-[-.05em] text-white md:text-4xl">{value}</p><p className="mt-2 text-[8px] font-bold uppercase tracking-[.2em] text-white/35 md:text-[9px]">{label}</p></div>)}
      </div>
    </section>

    <section className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36 xl:px-12">
      <div className="absolute left-1/2 top-20 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/[.08] blur-[170px]" />
      <div className="relative mx-auto max-w-[1360px]">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div><p className="premium-kicker">Ecossistema de formação</p><h2 className="mt-5 text-5xl font-black leading-[.92] tracking-[-.06em] text-white md:text-7xl">Não é um curso.<br /><span className="premium-text">É um sistema.</span></h2></div>
          <p className="max-w-2xl text-base leading-7 text-slate-400 lg:justify-self-end lg:text-lg">Uma biblioteca construída para acompanhar a evolução do técnico: da primeira abertura de aparelho ao diagnóstico eletrônico e à gestão profissional da bancada.</p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">{areas.map((area) => <Link href={area.href} key={area.number} className={`group relative min-h-[300px] overflow-hidden rounded-[24px] border border-white/[.11] bg-[#090c17] shadow-[0_28px_80px_rgba(0,0,0,.24)] transition duration-700 hover:-translate-y-1.5 hover:border-cyan-300/35 hover:shadow-[0_36px_100px_rgba(0,0,0,.45)] ${area.span}`}>
          <Image src={area.image} alt={`Trilha ${area.title}`} fill sizes="(max-width:1023px) calc(100vw - 40px), 58vw" className="object-cover object-center transition duration-1000 group-hover:scale-[1.045]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,16,.08)_0%,rgba(4,6,16,.3)_38%,rgba(4,6,16,.97)_100%)]" />
          <div className="absolute inset-0 opacity-0 ring-1 ring-inset ring-cyan-300/30 transition duration-500 group-hover:opacity-100" />
          <div className="relative flex min-h-[330px] flex-col p-5 md:p-7">
            <div className="flex items-center justify-between"><span className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.2em] text-white/70 backdrop-blur-md">Trilha {area.number}</span><div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/35 text-cyan-200 backdrop-blur-md"><area.icon size={21}/></div></div>
            <div className="mt-auto max-w-2xl max-w-2xl"><div className="mb-3 flex items-center gap-3"><span className="h-px w-9 bg-cyan-300/70"/><span className="text-[9px] font-black uppercase tracking-[.2em] text-cyan-200">6 formações</span></div><h3 className="text-2xl font-black leading-[.95] tracking-[-.045em] text-white md:text-3xl">{area.title}</h3><p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{area.text}</p><span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.17em] text-white">Explorar trilha <ArrowRight size={15} className="transition group-hover:translate-x-1.5"/></span></div>
          </div>
        </Link>)}</div>
      </div>
    </section>

    <section className="border-y border-white/[.08] bg-[#070914] px-5 py-24 md:px-8 md:py-36 xl:px-12" id="cursos">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-12 flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><div><p className="premium-kicker">Formações em destaque</p><h2 className="mt-4 text-4xl font-black tracking-[-.05em] text-white md:text-6xl">Comece pelo que muda<br />sua bancada agora.</h2></div><Link href="/cursos" className="group inline-flex w-fit items-center gap-3 text-xs font-black uppercase tracking-[.15em] text-white">Ver catálogo completo <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition group-hover:border-cyan-300/40 group-hover:bg-cyan-300/10"><ArrowRight size={16} /></span></Link></div>
        <div className="grid gap-5 lg:grid-cols-3">{featured.map((item) => <Link href={item.href} key={item.number} className="group overflow-hidden rounded-[30px] border border-white/[.1] bg-[#0a0d18] p-2 transition duration-500 hover:-translate-y-2 hover:border-cyan-300/30 hover:shadow-[0_35px_90px_rgba(0,0,0,.4)]">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] bg-black"><Image src={item.image} alt={item.title} fill loading="eager" sizes="(max-width:1024px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#050712]/95 via-transparent to-transparent" /><div className="absolute left-5 top-5 flex items-center gap-2"><span className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.17em] text-white backdrop-blur">{item.tag}</span></div></div>
          <div className="p-5 md:p-6"><div className="flex items-center justify-between"><span className="text-[10px] font-black tracking-[.2em] text-cyan-300">G·LAB / {item.number}</span><ChevronRight size={18} className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white" /></div><h3 className="mt-5 text-2xl font-black leading-tight tracking-[-.03em] text-white">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p><div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4"><span className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-xs font-black text-[#061014]">Comprar agora <ArrowRight size={14} /></span><span className="text-xs font-bold text-slate-500">Ver detalhes</span></div></div>
        </Link>)}</div>
      </div>
    </section>

    <section className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36 xl:px-12" id="metodo">
      <div className="absolute -right-64 top-24 h-[600px] w-[600px] rounded-full bg-violet-600/[.12] blur-[180px]" />
      <div className="relative mx-auto grid max-w-[1360px] gap-16 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
        <div className="lg:sticky lg:top-32"><p className="premium-kicker">Método G·LAB</p><h2 className="mt-5 text-5xl font-black leading-[.92] tracking-[-.06em] text-white md:text-7xl">Precisão é um<br /><span className="premium-text">processo.</span></h2><p className="mt-7 max-w-lg text-base leading-7 text-slate-400">O objetivo não é decorar defeitos. É aprender a pensar como técnico: observar, medir, interpretar e somente então intervir.</p>
          <div className="mt-9 inline-flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[.06] px-5 py-4 text-xs font-semibold text-emerald-100"><ShieldCheck size={18} className="text-emerald-400" /> Menos retrabalho. Mais consistência.</div>
        </div>
        <div className="relative"><div className="absolute bottom-8 left-[23px] top-8 w-px bg-gradient-to-b from-cyan-300/50 via-blue-500/30 to-transparent md:left-[31px]" />
          {[{n:"01",i:Microscope,t:"Observe o sintoma",d:"Colete evidências e entenda o comportamento antes de abrir o aparelho."},{n:"02",i:Gauge,t:"Meça o circuito",d:"Use ferramentas e referências para transformar suspeitas em dados."},{n:"03",i:Cpu,t:"Isole a causa",d:"Siga uma sequência lógica até localizar o setor responsável pela falha."},{n:"04",i:Wrench,t:"Execute com controle",d:"Intervenha com técnica, segurança térmica e padrão de acabamento."},{n:"05",i:Check,t:"Valide a entrega",d:"Teste funções, estabilidade e qualidade antes de devolver o equipamento."}].map((step, index) => <div key={step.n} className="relative mb-4 flex gap-5 rounded-[26px] border border-white/[.08] bg-white/[.025] p-5 transition hover:border-cyan-300/20 hover:bg-white/[.045] md:gap-7 md:p-7"><div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-[#071020] text-[10px] font-black text-cyan-300 md:h-16 md:w-16">{step.n}</div><div className="pt-1"><div className="flex items-center gap-3"><step.i size={18} className="text-cyan-300" /><h3 className="text-xl font-black text-white md:text-2xl">{step.t}</h3></div><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 md:text-base">{step.d}</p></div></div>)}
        </div>
      </div>
    </section>

    <section className="px-5 pb-24 md:px-8 md:pb-36 xl:px-12">
      <div className="mx-auto grid max-w-[1360px] overflow-hidden rounded-[36px] border border-white/[.1] bg-[#090c17] lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative min-h-[420px] overflow-hidden lg:min-h-[600px]"><Image src="/images/gj/guilherme-juliao.jpg" alt="Estrutura da formação G·LAB por Guilherme Julião" fill loading="eager" sizes="(max-width:1024px) 100vw, 55vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#090c17]/80" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-7 lg:hidden"><p className="text-sm font-bold text-white">Guilherme Julião · Responsável pela G·LAB</p></div></div>
        <div className="relative flex flex-col justify-center p-7 md:p-12 lg:p-16"><div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/[.1] blur-[100px]" /><div className="relative"><p className="premium-kicker">Autoria técnica</p><h2 className="mt-5 text-4xl font-black leading-[.98] tracking-[-.05em] text-white md:text-6xl">Experiência organizada para ensinar.</h2><p className="mt-7 text-base leading-7 text-slate-400">A G·LAB transforma conhecimento de assistência técnica em trilhas claras, módulos consultáveis e procedimentos aplicáveis à rotina real.</p><div className="mt-8 border-l-2 border-cyan-300/50 pl-5"><p className="text-lg font-black text-white">Guilherme Julião</p><p className="mt-1 text-xs font-bold uppercase tracking-[.16em] text-white/40">Responsável pela G·LAB · Paulínia, SP</p></div><Link href="/cursos" className="mt-9 inline-flex items-center gap-3 text-sm font-black text-cyan-200">Conhecer a biblioteca <ArrowRight size={17} /></Link></div></div>
      </div>
    </section>

    <section className="border-y border-white/[.08] bg-white/[.02] px-5 py-16 md:px-8 xl:px-12">
      <div className="mx-auto grid max-w-[1360px] gap-4 md:grid-cols-2 xl:grid-cols-4">{[
        {i:BookOpenCheck,t:"Conteúdo visível",d:"Currículo e módulos apresentados antes da decisão."},
        {i:RefreshCw,t:"Biblioteca evolutiva",d:"Estrutura preparada para novos procedimentos."},
        {i:Headphones,t:"Atendimento direto",d:"Canal aberto para dúvidas sobre as formações."},
        {i:LockKeyhole,t:"Ambiente seguro",d:"Checkout somente por plataforma oficial."}
      ].map(item => <div key={item.t} className="flex gap-4 rounded-2xl border border-white/[.08] bg-[#080b16] p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/[.08] text-cyan-300"><item.i size={18} /></div><div><h3 className="text-sm font-black text-white">{item.t}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{item.d}</p></div></div>)}
      </div>
    </section>

    <section className="px-5 py-24 md:px-8 md:py-36 xl:px-12"><div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[40px] border border-cyan-200/20 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.24),transparent_35%),linear-gradient(135deg,#0c3e79_0%,#193da8_48%,#5621a8_100%)] px-7 py-20 text-center shadow-[0_40px_120px_rgba(37,99,235,.24)] md:px-16 md:py-28"><div className="premium-grid absolute inset-0 opacity-20" /><div className="relative"><p className="text-[10px] font-black uppercase tracking-[.26em] text-cyan-100">Sua evolução começa com método</p><h2 className="mx-auto mt-6 max-w-5xl text-5xl font-black leading-[.9] tracking-[-.065em] text-white md:text-8xl">Construa uma bancada<br />que inspira confiança.</h2><p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-blue-100">Escolha a formação que resolve o seu próximo desafio e avance com uma rota técnica clara.</p><Link href="/cursos" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black text-blue-800 shadow-2xl transition hover:-translate-y-1">Explorar todas as formações <ArrowRight size={18} className="transition group-hover:translate-x-1" /></Link></div></div></section>
  </>
}

