export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-10 text-center">
        <div className="space-y-2">
          <h1 className="text-[clamp(4rem,12vw,9rem)] font-black tracking-tighter leading-none text-gray-950 select-none">
            G<span className="text-gray-400">•</span>Lab
          </h1>
          <p className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400">
            Assistência Técnica Mobile
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-gray-200" />

        {/* Message */}
        <div className="space-y-3 max-w-sm">
          <p className="text-gray-900 font-semibold text-lg leading-snug">
            Estamos em manutenção.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Voltamos em breve com novidades. Obrigado pela paciência.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-xs text-gray-300">
        &copy; 2025 G•Lab
      </p>
    </main>
  )
}
