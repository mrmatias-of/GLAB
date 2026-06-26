'use client'

import { useRef, useState } from 'react'
import { Camera, X, Check } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (data: { equipment: string; serialNumber: string }) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [recognizedText, setRecognizedText] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const startCamera = async () => {
    try {
      console.log('[v0] Iniciando câmera...')
      
      // Tentar com facing mode 'environment' primeiro (câmera traseira)
      // Se falhar, tentar sem especificar facing mode
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
        })
      } catch (e) {
        console.warn('[v0] Câmera traseira não disponível, tentando câmera frontal')
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
        })
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Garantir que o vídeo reproduz
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error('[v0] Erro ao reproduzir vídeo:', err)
          })
        }
        setCameraActive(true)
        console.log('[v0] Câmera iniciada com sucesso')
      }
    } catch (error) {
      console.error('[v0] Erro ao acessar câmera:', error)
      const errorMsg = error instanceof Error ? error.message : String(error)
      alert(`Não foi possível acessar a câmera: ${errorMsg}\n\nPermita acesso à câmera nas configurações do navegador.`)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL('image/jpeg')
        setCapturedImage(imageData)
        stopCamera()
        performOCR(imageData)
      }
    }
  }

  const performOCR = async (imageData: string) => {
    setLoading(true)
    try {
      // Usar a API do Google Cloud Vision ou Tesseract.js
      // Para prototipagem rápida, usaremos Tesseract.js (OCR client-side)
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      })

      if (!response.ok) throw new Error('Falha no OCR')
      const data = await response.json()
      setRecognizedText(data.text || '')
    } catch (error) {
      console.error('[v0] Erro no OCR:', error)
      alert('Erro ao reconhecer texto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setCapturedImage(imageData)
        performOCR(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const parseEquipmentData = () => {
    // Extrair modelo e número de série do texto reconhecido
    const lines = recognizedText.split('\n').filter((l) => l.trim())
    
    // Procurar por padrões comuns (número de série, modelo)
    let equipment = ''
    let serialNumber = ''

    for (const line of lines) {
      const cleanLine = line.trim()
      // Procurar por "SN:", "S/N:", "Serial"
      if (
        cleanLine.match(/^(SN|S\/N|Serial)[\s:]/i) ||
        (cleanLine.length > 8 && /^[A-Z0-9]{8,}$/.test(cleanLine))
      ) {
        serialNumber = cleanLine.replace(/^(SN|S\/N|Serial)[\s:]/i, '').trim()
      } else if (cleanLine.length > 3) {
        equipment = cleanLine
      }
    }

    onCapture({
      equipment: equipment || recognizedText.split('\n')[0] || '',
      serialNumber,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-900">
          <h3 className="text-lg font-bold text-white">Capturar Equipamento</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition text-slate-400"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {!capturedImage ? (
            <>
              {/* Camera View */}
              {cameraActive ? (
                <div className="space-y-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg bg-black aspect-video object-cover"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={capturePhoto}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
                    >
                      <Camera size={18} />
                      Capturar
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
                  >
                    <Camera size={20} />
                    Iniciar Câmera
                  </button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-900 text-slate-400">ou</span>
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                  >
                    Selecionar Foto
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {/* Captured Image */}
              <img src={capturedImage} alt="Capturada" className="w-full rounded-lg" />

              {/* OCR Results */}
              {loading ? (
                <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                  <p className="text-slate-300 text-sm">Reconhecendo texto...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Texto Reconhecido
                    </label>
                    <textarea
                      value={recognizedText}
                      onChange={(e) => setRecognizedText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={parseEquipmentData}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                    >
                      <Check size={18} />
                      Confirmar
                    </button>
                    <button
                      onClick={() => {
                        setCapturedImage(null)
                        setRecognizedText('')
                        startCamera()
                      }}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
