'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface ExecutionTimerProps {
  onTimeUpdate: (seconds: number) => void
  initialSeconds?: number
}

export function ExecutionTimer({
  onTimeUpdate,
  initialSeconds = 0,
}: ExecutionTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds((s) => {
        const newSeconds = s + 1
        onTimeUpdate(newSeconds)
        return newSeconds
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, onTimeUpdate])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
    onTimeUpdate(0)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cronômetro de Execução</h3>

      <div className="bg-gray-50 rounded-lg p-8 text-center mb-4">
        <div className="text-5xl font-mono font-bold text-blue-600">
          {formatTime(seconds)}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            isRunning
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Iniciar
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Tempo total de execução desta ordem de serviço
      </p>
    </div>
  )
}
