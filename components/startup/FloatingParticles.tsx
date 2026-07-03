'use client'

const PARTICLES = [
  { x: 12, y: 20, size: 2, dur: 18, delay: 0 },
  { x: 78, y: 60, size: 1.5, dur: 22, delay: 3 },
  { x: 35, y: 80, size: 2.5, dur: 16, delay: 6 },
  { x: 88, y: 15, size: 1, dur: 25, delay: 1 },
  { x: 55, y: 45, size: 2, dur: 20, delay: 8 },
  { x: 22, y: 70, size: 1.5, dur: 19, delay: 4 },
  { x: 65, y: 30, size: 1, dur: 24, delay: 9 },
  { x: 42, y: 88, size: 2, dur: 17, delay: 2 },
  { x: 90, y: 75, size: 1.5, dur: 21, delay: 11 },
  { x: 8, y: 50, size: 1, dur: 23, delay: 7 },
  { x: 72, y: 90, size: 2, dur: 15, delay: 5 },
  { x: 48, y: 10, size: 1.5, dur: 26, delay: 13 },
]

export function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gray-400 dark:bg-gray-500"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size * 3}px`,
            height: `${p.size * 3}px`,
            opacity: 0.08,
            filter: 'blur(1px)',
            animation: `floatParticle ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.08; }
          25% { transform: translateY(-18px) translateX(8px); opacity: 0.14; }
          50% { transform: translateY(-8px) translateX(-10px); opacity: 0.06; }
          75% { transform: translateY(-22px) translateX(4px); opacity: 0.12; }
        }
      `}</style>
    </div>
  )
}
