"use client"

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end group">
      {/* Tooltip label */}
      <span className="hidden sm:block mr-3 bg-[#0b1320] border border-[rgba(0,212,200,0.15)] text-foreground/90 text-xs font-medium px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-lg whitespace-nowrap pointer-events-none">
        Falar no WhatsApp
      </span>

      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="relative w-14 h-14 flex items-center justify-center"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-20" />
        {/* Button body */}
        <span className="relative z-10 w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_40px_rgba(37,211,102,0.65)] hover:scale-110 transition-all duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-7 h-7"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.004 2C6.477 2 2 6.478 2 12.004c0 1.77.463 3.508 1.34 5.033L2 22l5.108-1.316A10.01 10.01 0 0012.004 22C17.53 22 22 17.522 22 12.004 22 6.478 17.53 2 12.004 2zm0 18.198a8.19 8.19 0 01-4.17-1.14l-.3-.177-3.03.795.81-2.96-.197-.307A8.188 8.188 0 013.802 12c0-4.52 3.679-8.2 8.202-8.2 4.522 0 8.198 3.68 8.198 8.2 0 4.521-3.676 8.198-8.198 8.198z" />
          </svg>
        </span>
      </a>
    </div>
  )
}
