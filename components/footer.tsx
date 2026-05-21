import Link from "next/link"
import { Instagram, Youtube, Mail, MapPin } from "lucide-react"

const links = [
  { label: "Inicio", href: "/" },
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
    <footer className="relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">G</span>
            </div>
            <span className="text-white font-bold">G-Lab</span>
          </Link>
          <p className="text-sm text-white/40 leading-relaxed">
            Guias tecnicos praticos para profissionais de assistencia tecnica.
          </p>
          <div className="flex items-center gap-2 mt-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-violet-500/50 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-2">Navegacao</p>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Suporte */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-2">Suporte</p>
          <Link href="/contato" className="text-sm text-white/50 hover:text-white transition-colors">
            Central de Ajuda
          </Link>
          <Link href="/contato" className="text-sm text-white/50 hover:text-white transition-colors">
            FAQ
          </Link>
        </div>

        {/* Contato */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-2">Contato</p>
          <a
            href="https://wa.me/5519989398294"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366]" />
            WhatsApp
          </a>
          <a
            href="mailto:contato@glabcursos.com.br"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            contato@glabcursos.com.br
          </a>
          <div className="flex items-center gap-2 text-sm text-white/40 mt-2">
            <MapPin size={14} className="text-violet-400" />
            <span>Paulinia, SP - Brasil</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            2026 G-Lab Cursos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
