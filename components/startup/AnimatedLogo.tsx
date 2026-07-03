'use client'

import Image from 'next/image'

export function AnimatedLogo() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow behind logo */}
      <div
        className="absolute rounded-full"
        style={{
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(109,77,255,0.22) 0%, rgba(59,130,246,0.12) 50%, transparent 70%)',
          filter: 'blur(16px)',
          animation: 'breatheGlow 4s ease-in-out infinite',
        }}
      />

      {/* Logo wrapper — fade in + scale on mount, then breathe */}
      <div
        style={{
          animation: 'logoEnter 0.9s cubic-bezier(0.22,1,0.36,1) forwards, breatheLogo 4s ease-in-out 0.9s infinite',
          opacity: 0,
          willChange: 'transform, opacity',
          position: 'relative',
        }}
      >
        {/* Sheen overlay — runs every 4s */}
        <div
          className="absolute inset-0 z-10 rounded-xl overflow-hidden pointer-events-none"
          style={{ animation: 'sheen 4s ease-in-out 2s infinite' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '60%',
              height: '100%',
              background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.28) 50%, transparent 80%)',
              animation: 'sheenSlide 4s ease-in-out 2s infinite',
              willChange: 'transform',
            }}
          />
        </div>

        <Image
          src="/logo.png"
          alt="G-Lab"
          width={200}
          height={200}
          priority
          className="relative z-0 select-none"
          draggable={false}
        />
      </div>

      <style>{`
        @keyframes logoEnter {
          0%   { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes breatheLogo {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.02); }
        }
        @keyframes breatheGlow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.12); }
        }
        @keyframes sheenSlide {
          0%          { transform: translateX(0%); opacity: 0; }
          10%         { opacity: 1; }
          40%         { transform: translateX(370%); opacity: 1; }
          50%, 100%   { transform: translateX(370%); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
