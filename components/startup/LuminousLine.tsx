'use client'

export function LuminousLine() {
  return (
    <div
      className="relative overflow-hidden rounded-full"
      style={{ width: '120px', height: '2px', background: '#E5E7EB' }}
      aria-hidden="true"
    >
      {/* Traveling glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-40%',
          width: '40%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #9CA3AF, transparent)',
          borderRadius: '999px',
          animation: 'lineGlow 2s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <style>{`
        @keyframes lineGlow {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  )
}
