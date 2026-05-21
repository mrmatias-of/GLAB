import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Layers, Cpu, Smartphone, Monitor } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

const getIconByTag = (tag: string) => {
  if (tag?.toLowerCase().includes("mobile") || tag?.toLowerCase().includes("android")) return Smartphone
  if (tag?.toLowerCase().includes("pc") || tag?.toLowerCase().includes("windows")) return Monitor
  if (tag?.toLowerCase().includes("combo")) return Layers
  return Cpu
}

export default async function CursosPreview() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, tag, titulo, descricao, preco, preco_original, destaque, imagem")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(4)

  if (!cursos?.length) return null

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(37,99,235,0.1)_0%,transparent_65%)]" />

      <div className="relative max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[#3b82f6]/70 text-sm font-light italic mb-2 tracking-wide">Nossos Guias</p>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              <span className="text-foreground">Comece a aprender</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]">agora mesmo</span>
            </h2>
          </div>
          <Link
            href="/cursos"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#3b82f6] hover:text-foreground transition-colors shrink-0"
          >
            Ver todos os guias
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cursos.map((c) => {
            const Icon = getIconByTag(c.tag)
            return (
              <Link
                key={c.id}
                href={`/cursos/${c.slug}`}
                className={`group relative rounded-xl border bg-[#080f1c] transition-all duration-300 flex flex-col overflow-hidden ${
                  c.destaque
                    ? "border-[#3b82f6]/40 shadow-[0_0_30px_rgba(59,130,246,0.12)] hover:shadow-[0_0_50px_rgba(59,130,246,0.22)]"
                    : "border-white/8 hover:border-[#3b82f6]/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.1)]"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video overflow-hidden">
                  {c.imagem ? (
                    <Image
                      src={c.imagem}
                      alt={c.titulo}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0d1a2e] to-[#04080f] flex items-center justify-center">
                      <Icon size={32} className="text-[#3b82f6]/40" />
                    </div>
                  )}
                  {/* Overlay gradient bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080f1c] via-transparent to-transparent opacity-70" />
                  {/* Popular badge */}
                  {c.destaque && (
                    <div className="absolute top-2 right-2">
                      <span className="text-[9px] font-black tracking-wider text-white bg-[#2563eb] px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)]">
                        POPULAR
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative z-10 p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#3b82f6]/70 uppercase mb-1.5">{c.tag}</span>
                  <h3 className="text-sm font-bold text-foreground mb-2 group-hover:text-[#60a5fa] transition-colors line-clamp-2 leading-snug">
                    {c.titulo}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                    {c.descricao}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      {c.preco_original && (
                        <span className="text-[10px] text-muted-foreground line-through">{c.preco_original}</span>
                      )}
                      <span className="text-base font-black text-[#60a5fa]">{c.preco}</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#2563eb]/15 border border-[#3b82f6]/30 flex items-center justify-center group-hover:bg-[#2563eb] group-hover:border-[#2563eb] transition-all duration-300">
                      <ArrowRight size={12} className="text-[#60a5fa] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Bottom tagline */}
        <div className="mt-10 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          {["Moderno", "Prático", "Atualizado", "Profissional"].map((t, i, a) => (
            <span key={t} className="flex items-center gap-3">
              {t}
              {i < a.length - 1 && <span className="w-1 h-1 rounded-full bg-[#3b82f6]/40" />}
            </span>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white text-sm font-bold hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all duration-300 shadow-[0_0_25px_rgba(37,99,235,0.35)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] group"
          >
            Ver Todos os Guias
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
