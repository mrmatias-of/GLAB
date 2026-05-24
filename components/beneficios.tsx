import Link from "next/link"
import { ArrowRight, MessageCircle, Monitor, Award, Clock, Headphones, FileCheck, Shield } from "lucide-react"

export default function Beneficios() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: '#050510' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* 3 Cards de Beneficios */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          
          {/* Comunidade */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-[#0a0a14] to-[#050510] p-6">
            <p className="text-[10px] uppercase tracking-widest text-cyan-400 mb-3">Comunidade Exclusiva</p>
            <h3 className="text-xl font-black text-white mb-2">
              Faca Parte da Maior<br />Comunidade Tecnica
            </h3>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Tire duvidas, compartilhe conhecimento e evolua junto com outros tecnicos.
            </p>
            
            {/* Mock community preview */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20" />
                <span className="text-[10px] text-white/60">Comunidade G-Lab</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[9px] text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>Duvida sobre PMIC</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <span>Curto em linha de 1.8V</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Intermitente na rede</span>
                </div>
              </div>
            </div>
            
            <Link 
              href="/grupo-vip"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all"
            >
              Entrar na Comunidade
            </Link>
          </div>

          {/* Area do Aluno */}
          <div className="relative rounded-2xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-[#0a0a14] to-[#050510] p-6">
            <p className="text-[10px] uppercase tracking-widest text-violet-400 mb-3">Area do Aluno</p>
            <h3 className="text-xl font-black text-white mb-2">
              Aprenda do Seu<br />Jeito, Quando Quiser
            </h3>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Acesse as aulas, materiais e atualizacoes na plataforma.
            </p>
            
            {/* Mock platform preview */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Monitor size={14} className="text-violet-400" />
                <span className="text-[10px] text-white/60">Meus Cursos</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {['PMIC', 'Diagnostico', 'Software'].map((item) => (
                  <div key={item} className="aspect-video rounded bg-violet-500/10 flex items-center justify-center">
                    <span className="text-[7px] text-violet-400/60">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Link 
              href="/cursos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 transition-all"
            >
              Acessar Minha Conta
            </Link>
          </div>

          {/* Certificado */}
          <div className="relative rounded-2xl overflow-hidden border border-orange-500/20 bg-gradient-to-br from-[#0a0a14] to-[#050510] p-6">
            <p className="text-[10px] uppercase tracking-widest text-orange-400 mb-3">Evolua Sua Carreira</p>
            <h3 className="text-xl font-black text-white mb-2">
              Do Basico ao Avancado<br />Com Metodo Testado
            </h3>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Conteudo atualizado, suporte especializado e certificacao reconhecida.
            </p>
            
            {/* Mock certificate preview */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 mb-6">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Award size={24} className="text-orange-400 mx-auto mb-1" />
                  <span className="text-[8px] text-white/40 block">CERTIFICADO</span>
                  <span className="text-[10px] text-white/60">de Conclusao</span>
                </div>
              </div>
            </div>
            
            <Link 
              href="/cursos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all"
            >
              Quero Me Matricular
            </Link>
          </div>
        </div>

        {/* CTA Final */}
        <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-r from-[#0a0a14] via-[#0a0a14] to-cyan-950/20 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                Pronto para <span className="text-cyan-400">Levar</span> Sua<br />
                Assistencia Tecnica ao Proximo Nivel?
              </h2>
              <p className="text-sm text-white/50">
                Transforme seu conhecimento em resultados. Aprenda com quem vive a pratica todos os dias.
              </p>
            </div>
            
            <Link 
              href="/cursos"
              className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:brightness-110"
              style={{ backgroundColor: '#00d4c8' }}
            >
              Comecar Agora
              <ArrowRight size={18} />
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Clock size={14} className="text-cyan-400" />
              <span>Acesso Imediato</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Headphones size={14} className="text-cyan-400" />
              <span>Suporte Especializado</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <FileCheck size={14} className="text-cyan-400" />
              <span>Certificado Incluso</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Shield size={14} className="text-cyan-400" />
              <span>7 Dias de Garantia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
