import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0e0e14] flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-10 text-center">
        {/* Real logo */}
        <Image
          src="/logo-glab-neon.png"
          alt="G•Lab"
          width={220}
          height={220}
          priority
          className="select-none"
        />

        {/* Divider */}
        <div className="w-12 h-px bg-white/10" />

        {/* Message */}
        <div className="space-y-3 max-w-sm">
          <p className="text-white font-semibold text-lg leading-snug">
            Estamos em manutenção.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Voltamos em breve com novidades. Obrigado pela paciência.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-xs text-gray-600">
        &copy; 2025 G•Lab
      </p>
    </main>
  )
}
