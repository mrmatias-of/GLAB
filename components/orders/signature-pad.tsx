'use client'

import React, { useRef, useState, useEffect } from 'react'
import { RotateCcw, Check } from 'lucide-react'

interface SignaturePadProps {
  onSignatureCapture: (signature: string) => void
  signatureType: 'technician' | 'client'
  readOnly?: boolean
  existingSignature?: string
}

export function SignaturePad({
  onSignatureCapture,
  signatureType,
  readOnly = false,
  existingSignature,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isSigned, setIsSigned] = useState(!!existingSignature)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || readOnly) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.parentElement?.getBoundingClientRect()
    if (rect) {
      canvas.width = rect.width
      canvas.height = rect.height
    }

    // If there's an existing signature, display it
    if (existingSignature) {
      const img = new Image()
      img.src = existingSignature
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
    }

    // Setup drawing
    const startDrawing = (e: MouseEvent | TouchEvent) => {
      if (readOnly) return
      setIsDrawing(true)

      const rect = canvas.getBoundingClientRect()
      const x =
        (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left
      const y =
        (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top

      ctx.beginPath()
      ctx.moveTo(x, y)
    }

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || readOnly) return

      const rect = canvas.getBoundingClientRect()
      const x =
        (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left
      const y =
        (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top

      ctx.lineTo(x, y)
      ctx.stroke()
    }

    const stopDrawing = () => {
      setIsDrawing(false)
      ctx.closePath()

      // Check if something was drawn
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      let hasSignature = false
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) {
          hasSignature = true
          break
        }
      }
      setIsSigned(hasSignature)
    }

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('touchstart', startDrawing)
    canvas.addEventListener('touchmove', draw)
    canvas.addEventListener('touchend', stopDrawing)

    // Style the canvas
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
      canvas.removeEventListener('touchstart', startDrawing)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stopDrawing)
    }
  }, [readOnly, existingSignature])

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setIsSigned(false)
    }
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const signature = canvas.toDataURL('image/png')
    onSignatureCapture(signature)
  }

  const label = signatureType === 'technician' ? 'Assinatura do Técnico' : 'Assinatura do Cliente'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{label}</h3>

      <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 mb-4">
        <div className="relative w-full h-48">
          <canvas
            ref={canvasRef}
            className={`w-full h-full rounded cursor-crosshair bg-white ${
              readOnly ? 'cursor-default' : ''
            }`}
          />
        </div>
      </div>

      {!readOnly && (
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Limpar
          </button>
          <button
            onClick={handleSave}
            disabled={!isSigned}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium ${
              isSigned
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            Confirmar
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        {readOnly
          ? 'Assinatura já foi capturada'
          : 'Desenhe sua assinatura no campo acima e clique em Confirmar'}
      </p>
    </div>
  )
}
