'use client'

import { useRef, useState, useEffect } from 'react'
import { Camera, X, Check, Upload } from 'lucide-react'

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
      }
    }
    reader.readAsDataURL(file)
  }

  const handleConfirm = () => {
    if (!equipment.trim() || !serial.trim()) {
      alert('Preencha equipamento e série')
      return
    }
    onCapture({ equipment, serialNumber: serial })
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
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Capturar Equipamento</h2>
          <button onClick={handleCancel} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {mode === 'menu' && (
            <div className="space-y-3">
              <button
                onClick={openCamera}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
              >
                <Camera size={20} />
                Abrir Câmera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
              >
                <Upload size={20} />
                Carregar Foto
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
            <div className="space-y-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                crossOrigin="anonymous"
                className="w-full rounded-lg bg-black aspect-square object-cover"
                onLoadedMetadata={() => console.log('[v0] Video metadata carregada')}
                onPlay={() => console.log('[v0] Video começou a reproduzir')}
                onError={(e) => console.error('[v0] Erro no vídeo:', e)}
              />
                {!stream && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <p className="text-white text-sm">Abrindo câmera...</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={capturePhoto}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
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
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {mode === 'preview' && photo && (
            <div className="space-y-4">
              <img src={photo} alt="Capturada" className="w-full rounded-lg border border-slate-700" />
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Equipamento
                  </label>
                  <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="Ex: iPhone 14 Pro"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Número de Série
                  </label>
                  <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="Ex: ABC123XYZ"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setMode('menu')}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
                  >
                    <Check size={18} />
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
