'use client'

import Image from "next/image"
import { Instagram } from "lucide-react"

export default function ComboAuthoritySection() {
  const badges = [
    { top: "+10 anos", bottom: "de experiência" },
    { top: "Prático", bottom: "para a bancada" },
    { top: "Direto", bottom: "ao ponto" },
  ]

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: "#080b12" }}
      aria-labelledby="authority-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Eyebrow */}
        <p
          className="text-center text-xs font-bold tracking-widest uppercase mb-12"
          style={{ color: "#00d4c8" }}
        >
          Quem é o GJ
        </p>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Foto */}
          <div className="flex-shrink-0 flex flex-col items-center gap-6">
            <div
              className="relative w-56 h-56 rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(0,212,200,0.3)",
                boxShadow:
                  "0 0 32px rgba(0,212,200,0.1), 0 0 64px rgba(139,92,246,0.06)",
              }}
            >
              <Image
                src="/images/gj/guilherme-juliao.jpg"
                alt="Guilherme Julião, criador da G•Lab Cursos"
                fill
                className="object-cover grayscale"
                sizes="224px"
                priority
              />
            </div>

            {/* Badges de autoridade */}
            <div className="flex gap-3">
              {badges.map((b) => (
                <div
                  key={b.top}
                  className="flex flex-col items-center px-3 py-2 rounded-lg text-center"
                  style={{
                    backgroundColor: "#0a0e16",
                    border: "1px solid rgba(0,212,200,0.15)",
                  }}
                >
                  <span
                    className="text-sm font-black leading-tight"
                    style={{ color: "#00d4c8" }}
                  >
                    {b.top}
                  </span>
                  <span
                    className="text-[10px] font-medium leading-tight mt-0.5"
                    style={{ color: "#71717a" }}
                  >
                    {b.bottom}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Texto */}
          <div className="flex-1 space-y-5">
            <h2
              id="authority-heading"
              className="text-2xl md:text-3xl font-black tracking-tight text-white"
            >
              Guilherme Julião{" "}
              <span style={{ color: "#00d4c8" }}>(GJ)</span>
            </h2>

            <p className="text-base leading-relaxed" style={{ color: "#a1a1aa" }}>
              Guilherme Julião é o criador da G•Lab Cursos. Com 10 anos de
              experiência, desenvolve conteúdos técnicos voltados para quem
              deseja aprender procedimentos práticos e evoluir na rotina de
              assistência técnica.
            </p>

            <p className="text-base leading-relaxed" style={{ color: "#a1a1aa" }}>
              O foco dos materiais é apresentar conteúdos organizados, objetivos
              e aplicáveis à bancada, ajudando o aluno a construir sua base
              técnica com clareza.
            </p>

            <a
              href="https://www.instagram.com/_gjuliao/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors mt-2"
              style={{ color: "#00d4c8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#00d4c8")}
            >
              <Instagram size={16} />
              Acompanhar @_gjuliao no Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
