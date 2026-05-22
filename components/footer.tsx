import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer
      className="px-6 pt-14 pb-8"
      style={{ backgroundColor: '#0B0B0C', borderTop: '1px solid #27272a' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity w-fit">
              <Image
                src="/logo-glab-neon.png"
                alt="G-LAB Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-white font-extrabold tracking-widest uppercase text-xs">G•LAB</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>
              Guias técnicos práticos para profissionais de assistência técnica.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <p className="eyebrow mb-4">Navegação</p>
            <ul className="space-y-2.5">
              {['Home', 'Cursos', 'Contato'].map((l) => (
                <li key={l}>
                  <Link
                    href={l === 'Home' ? '/' : `/${l.toLowerCase()}`}
                    className="text-sm transition-colors hover:text-indigo-300"
                    style={{ color: '#818cf8' }}
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="eyebrow mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/termos" className="text-sm transition-colors hover:text-indigo-300" style={{ color: '#818cf8' }}>
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-sm transition-colors hover:text-indigo-300" style={{ color: '#818cf8' }}>
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <p className="eyebrow mb-4">Contato</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://wa.me/5519989398294"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-indigo-300"
                  style={{ color: '#818cf8' }}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:contato@glabcursos.com.br" className="text-sm transition-colors hover:text-indigo-300" style={{ color: '#818cf8' }}>
                  contato@glabcursos.com.br
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Rodapé */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-2 pt-6 text-xs"
          style={{ borderTop: '1px solid #27272a', color: '#3f3f46' }}
        >
          <p>&copy; {new Date().getFullYear()} G•LAB Cursos. Todos os direitos reservados.</p>
          <p>Paulínia, SP — Brasil</p>
        </div>
      </div>
    </footer>
  )
}
