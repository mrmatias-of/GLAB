export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511999999999"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-5 z-50 group flex items-center gap-3 overflow-hidden"
    >
      {/* Label tooltip */}
      <span className="hidden sm:block bg-surface border border-[rgba(0,212,200,0.15)] text-foreground/90 text-xs font-medium px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-lg whitespace-nowrap">
        Falar no WhatsApp
      </span>

      {/* Button */}
      <div className="relative w-14 h-14 rounded-2xl bg-[#1DB954] flex items-center justify-center shadow-[0_4px_24px_rgba(29,185,84,0.4)] hover:shadow-[0_4px_36px_rgba(29,185,84,0.6)] hover:scale-110 transition-all duration-300">
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-2xl bg-[#1DB954] animate-ping opacity-20" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="white"
          className="w-7 h-7 relative z-10"
          aria-hidden="true"
        >
          <path d="M16 3C8.832 3 3 8.832 3 16c0 2.284.6 4.43 1.647 6.285L3 29l6.938-1.617A12.93 12.93 0 0016 29c7.168 0 13-5.832 13-13S23.168 3 16 3zm0 2c6.065 0 11 4.935 11 11s-4.935 11-11 11a10.94 10.94 0 01-5.58-1.527l-.39-.234-4.118.96.99-3.988-.258-.41A10.94 10.94 0 015 16C5 9.935 9.935 5 16 5zm-3.5 5c-.277 0-.725.104-1.105.52-.38.417-1.395 1.354-1.395 3.305 0 1.95 1.422 3.835 1.621 4.099.199.264 2.754 4.352 6.77 5.93.945.367 1.682.586 2.256.75.948.272 1.812.234 2.494.142.76-.103 2.342-.951 2.672-1.87.33-.918.33-1.703.231-1.869-.099-.165-.363-.264-.76-.463-.396-.199-2.342-1.155-2.705-1.287-.363-.132-.627-.198-.89.199-.264.396-1.02 1.287-1.252 1.551-.23.264-.462.297-.858.099-.396-.198-1.672-.616-3.187-1.964-1.178-1.048-1.972-2.342-2.204-2.738-.231-.396-.024-.61.174-.807.179-.178.396-.463.594-.695.199-.231.265-.396.397-.66.132-.264.066-.495-.033-.694-.099-.198-.89-2.145-1.22-2.934-.316-.756-.638-.656-.89-.668-.23-.01-.495-.012-.759-.012z" />
        </svg>
      </div>
    </a>
  )
}
