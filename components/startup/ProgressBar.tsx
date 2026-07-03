'use client'

interface ProgressBarProps {
  progress: number // 0-100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full" style={{ maxWidth: '380px' }}>
      {/* Track */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height: '6px',
          background: '#E5E7EB',
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Fill */}
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #111827 0%, #6B7280 100%)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'width',
          }}
        />
      </div>

      {/* Percentage */}
      <span
        className="text-xs font-semibold tabular-nums"
        style={{
          color: '#6B7280',
          letterSpacing: '0.04em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {Math.round(progress)}%
      </span>
    </div>
  )
}
