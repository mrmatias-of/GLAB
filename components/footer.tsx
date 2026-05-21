import Link from "next/link"
import { Instagram, Youtube, Mail, MapPin } from "lucide-react"

const links = [
  { label: "Início", href: "/" },
  { label: "Cursos", href: "/cursos" },
  { label: "Contato", href: "/contato" },
]

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Mail, href: "mailto:contato@glabcursos.com.br", label: "E-mail" },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-[rgba(0,212,200,0.1)] overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-3 gap-10">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-9 h-9 rounded-xl bg-cyan/15 border border-cyan/30 flex items-center justify-center">
              <span className="text-cyan font-black text-sm">G</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-foreground font-bold text-sm tracking-wide">G•Lab</span>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Guias Mestre</span>
            </div>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Guias técnicos práticos para profissionais de assistência técnica
            que querem resultados reais.
          </p>
          <div className="flex items-center gap-2 mt-1">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-cyan hover:border-cyan/30 transition-all duration-200"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">Navegação</p>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">Contato</p>
          <a
            href="https://wa.me/5519989398294"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366]" />
            WhatsApp
          </a>
          <a
            href="mailto:contato@glabcursos.com.br"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            contato@glabcursos.com.br
          </a>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <MapPin size={14} className="text-cyan flex-shrink-0" />
            <span>Paulinia, SP - Brasil</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(0,212,200,0.06)] py-5 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 G•Lab Cursos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
