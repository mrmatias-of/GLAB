import { createClient } from "@/lib/supabase/server"
import { BookOpen, Star, TrendingUp, Link as LinkIcon, Zap, Users, Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: cursos } = await supabase.from("cursos").select("*").order("ordem")

  const total = cursos?.length ?? 0
  const destaques = cursos?.filter((c) => c.destaque).length ?? 0
  const comCheckout = cursos?.filter((c) => c.cta_href && c.cta_href !== "#").length ?? 0
  const ativos = cursos?.filter((c) => c.ativo).length ?? 0

  const stats = [
    { label: "Total de Cursos", value: total, icon: BookOpen, gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
    { label: "Em Destaque", value: destaques, icon: Star, gradient: "from-amber-400 to-orange-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    { label: "Com Checkout", value: comCheckout, icon: ShoppingCart, gradient: "from-emerald-400 to-green-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    { label: "Ativos", value: ativos, icon: Zap, gradient: "from-violet-400 to-purple-500", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  ]

  const quickActions = [
    { num: "01", label: "Novo Curso", desc: "Cadastrar um novo curso na plataforma", href: "/admin/cursos/novo", icon: BookOpen },
    { num: "02", label: "Ver Cursos", desc: "Gerenciar cursos existentes e editar detalhes", href: "/admin/cursos", icon: Eye },
    { num: "03", label: "Vendas", desc: "Acompanhar vendas e métricas de receita", href: "/admin/vendas", icon: TrendingUp },
    { num: "04", label: "Ver Site", desc: "Visualizar o site público como visitante", href: "/", icon: LinkIcon },
  ]

  return (
    <div className="min-h-screen p-8" style={{ background: '#050510' }}>
      {/* Header com efeito glow */}
      <div className="mb-10 relative">
        <div className="absolute -top-4 -left-4 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#00d4c8' }}>Painel Administrativo</p>
          <h1 className="text-4xl font-black text-white">
            Dashboard <span style={{ background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>G-LAB</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">Gerencie seus cursos, vendas e conteúdos da plataforma</p>
        </div>
      </div>

      {/* Stats Cards com visual tech */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div 
              key={s.label} 
              className="relative overflow-hidden rounded-2xl border border-cyan-500/20 p-6 transition-all duration-300 hover:border-cyan-500/40 hover:scale-105"
              style={{ background: 'rgba(0,212,200,0.03)' }}
            >
              {/* Glow effect */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${s.gradient} opacity-10 blur-2xl`} />
              
              <div className="relative">
                <div 
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-4`}
                  style={{ boxShadow: '0 0 20px rgba(0,212,200,0.3)' }}
                >
                  <Icon size={18} className="text-black" strokeWidth={2} />
                </div>
                <p className="text-4xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/40 mt-1 font-medium">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions - Cards numerados estilo da imagem */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-teal-500 rounded-full" />
          <h2 className="text-lg font-black text-white">Acesso Rápido</h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.num}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 p-5 transition-all duration-300 hover:border-cyan-500/50 hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                {/* Number badge */}
                <div className="flex items-start justify-between mb-4">
                  <span 
                    className="text-2xl font-black"
                    style={{ background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {action.num}
                  </span>
                  <div 
                    className="w-10 h-10 rounded-xl border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-500/50 transition-all"
                    style={{ background: 'rgba(0,212,200,0.1)' }}
                  >
                    <Icon size={18} className="text-cyan-400" strokeWidth={1.5} />
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-sm mb-1 group-hover:text-cyan-400 transition-colors">
                  {action.label}
                </h3>
                <p className="text-white/30 text-xs leading-relaxed">
                  {action.desc}
                </p>

                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Cursos recentes com visual melhorado */}
      <div 
        className="rounded-2xl border border-cyan-500/20 overflow-hidden"
        style={{ background: 'rgba(0,212,200,0.02)' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #00d4c8 0%, #7c3aed 100%)' }} />
            <h2 className="font-black text-white">Cursos Cadastrados</h2>
            <span className="text-xs text-white/30 font-medium">({total} total)</span>
          </div>
          <Link
            href="/admin/cursos/novo"
            className="flex items-center gap-2 text-xs font-bold text-black px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)',
              boxShadow: '0 0 20px rgba(0,212,200,0.3)'
            }}
          >
            <Zap size={14} strokeWidth={2.5} />
            Novo Curso
          </Link>
        </div>

        <div className="divide-y divide-cyan-500/10">
          {cursos?.slice(0, 8).map((curso, index) => (
            <div 
              key={curso.id} 
              className="flex items-center justify-between px-6 py-4 hover:bg-cyan-500/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                {/* Index number */}
                <span className="text-lg font-black text-white/20 w-6">
                  {String(index + 1).padStart(2, '0')}
                </span>
                
                {/* Status dot */}
                <div 
                  className={`w-2.5 h-2.5 rounded-full ${curso.ativo ? "" : "bg-white/20"}`}
                  style={curso.ativo ? { background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)', boxShadow: '0 0 10px rgba(0,212,200,0.5)' } : {}}
                />
                
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{curso.titulo}</p>
                  <p className="text-xs text-white/30">{curso.tag} · <span style={{ color: '#00d4c8' }}>{curso.preco}</span></p>
                </div>

                {curso.destaque && (
                  <span 
                    className="text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-500/30"
                    style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}
                  >
                    DESTAQUE
                  </span>
                )}
              </div>

              <Link
                href={`/admin/cursos/editar/${curso.id}`}
                className="text-xs font-medium text-white/50 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 px-4 py-2 rounded-xl transition-all hover:bg-cyan-500/5"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>

        {cursos && cursos.length > 8 && (
          <div className="p-4 border-t border-cyan-500/10 text-center">
            <Link href="/admin/cursos" className="text-xs font-medium transition-colors" style={{ color: '#00d4c8' }}>
              Ver todos os {total} cursos
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
