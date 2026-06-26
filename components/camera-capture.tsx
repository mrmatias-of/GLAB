'use client'

import { useRef, useState, useEffect } from 'react'
import { Camera, X, Check, Upload, Loader, AlertCircle } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (data: { equipment: string; serialNumber: string }) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [mode, setMode] = useState<'menu' | 'camera' | 'preview'>('menu')
  const [photo, setPhoto] = useState<string | null>(null)
  const [equipment, setEquipment] = useState('')
  const [serial, setSerial] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [aiSuggestion, setAiSuggestion] = useState<string>('')

  // Configurar video stream quando stream muda
  useEffect(() => {
    if (stream && videoRef.current && mode === 'camera') {
      console.log('[v0] Configurando stream no vídeo')
      videoRef.current.srcObject = stream
      
      // Tentar reproduzir imediatamente
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('[v0] Vídeo reproduzindo'))
          .catch((err) => console.error('[v0] Erro ao reproduzir:', err))
      }
    }
  }, [stream, mode])

  // Cleanup stream ao desmontar ou ao voltar
  useEffect(() => {
    return () => {
      if (stream) {
        console.log('[v0] Limpando stream')
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const openCamera = async () => {
    try {
      console.log('[v0] Solicitando acesso à câmera...')
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      })
      console.log('[v0] Stream obtida com sucesso')
      setStream(mediaStream)
      setMode('camera')
    } catch (error) {
      console.error('[v0] Erro ao acessar câmera:', error)
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          alert('Você negou acesso à câmera. Permita nas configurações do navegador.')
        } else if (error.name === 'NotFoundError') {
          alert('Nenhuma câmera encontrada neste dispositivo.')
        } else {
          alert(`Erro da câmera: ${error.message}`)
        }
      }
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)
        const photoData = canvasRef.current.toDataURL('image/jpeg')
        setPhoto(photoData)
        setMode('preview')
        analyzeWithAI(photoData)
        
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
          setStream(null)
        }
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === 'string') {
        setPhoto(result)
        setMode('preview')
        analyzeWithAI(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const analyzeWithAI = async (imageBase64: string) => {
    try {
      setValidating(true)
      console.log('[v0] Analisando imagem com IA...')
      
      const response = await fetch('/api/validate-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64.split(',')[1],
          recognizedText: '',
          equipment: '',
        }),
      })

      if (!response.ok) {
        console.error('[v0] Erro na análise')
        setAiSuggestion('Não foi possível analisar a imagem. Preencha manualmente.')
        return
      }

      const data = await response.json()
      console.log('[v0] Análise concluída:', data.validation)
      setValidationResult(data.validation)
      
      if (data.validation.isValid && data.validation.brand) {
        const suggestion = `${data.validation.brand} ${data.validation.model || ''}`.trim()
        setAiSuggestion(suggestion)
        setEquipment(suggestion)
      } else {
        setAiSuggestion('Equipamento não identificado. Preencha manualmente.')
      }
    } catch (error) {
      console.error('[v0] Erro:', error)
      setAiSuggestion('Erro ao analisar. Tente novamente.')
    } finally {
      setValidating(false)
    }
  }

  const handleConfirm = () => {
    if (!equipment.trim()) {
      alert('Preencha o equipamento')
      return
    }
    onCapture({ 
      equipment: equipment.trim(), 
      serialNumber: serial.trim() 
    })
  }

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0 bg-slate-950">
          <h2 className="text-lg font-bold text-white">Capturar Equipamento</h2>
          <button onClick={handleCancel} className="text-slate-400 hover:text-white flex-shrink-0">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mode === 'menu' && (
            <div className="space-y-3 flex flex-col h-full justify-center">
              <button
                onClick={openCamera}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium text-lg"
              >
                <Camera size={24} />
                Abrir Câmera
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
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium text-lg"
              >
                <Upload size={24} />
                Carregar Foto da Galeria
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {mode === 'camera' && (
            <div className="space-y-4 flex flex-col h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg bg-black flex-1 object-cover"
              />
              <div className="flex gap-2">
                <button
                  onClick={capturePhoto}
                  className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
                >
                  Capturar
                </button>
                <button
                  onClick={() => {
                    if (stream) {
                      stream.getTracks().forEach((track) => track.stop())
                      setStream(null)
                    }
                    setMode('menu')
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {mode === 'preview' && photo && (
            <div className="space-y-4 flex flex-col h-full">
              {/* Imagem */}
              <div className="w-full rounded-lg overflow-hidden border border-slate-700 bg-black">
                <img src={photo} alt="Capturada" className="w-full h-auto max-h-48 object-cover" />
              </div>

              {/* Status de análise */}
              {validating && (
                <div className="p-4 bg-slate-800/50 rounded-lg flex items-center gap-3">
                  <Loader size={20} className="animate-spin text-cyan-500" />
                  <span className="text-sm text-slate-300">Analisando imagem...</span>
                </div>
              )}

              {!validating && validationResult && (
                <div className={`p-4 rounded-lg border ${validationResult.isValid ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className={validationResult.isValid ? 'text-green-400' : 'text-yellow-400'} />
                    <div className="flex-1 text-sm">
                      <p className={validationResult.isValid ? 'text-green-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                        {validationResult.isValid ? 'Equipamento identificado' : 'Verifique a imagem'}
                      </p>
                      {aiSuggestion && (
                        <p className="text-slate-300 text-xs mt-1">{aiSuggestion}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Formulário */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Equipamento *
                  </label>
                  <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="Ex: iPhone 14 Pro Max"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Número de Série
                  </label>
                  <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="Ex: ABC123XYZ (opcional)"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 text-base"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      setMode('menu')
                      setPhoto(null)
                      setEquipment('')
                      setSerial('')
                      setValidationResult(null)
                      setAiSuggestion('')
                    }}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={validating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg transition font-medium"
                  >
                    <Check size={20} />
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
