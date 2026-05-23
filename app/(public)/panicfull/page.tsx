'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import Link from 'next/link'
import { Upload, FileText, AlertTriangle, CheckCircle, Loader2, ArrowLeft, Cpu, Smartphone, Bug } from 'lucide-react'

interface Falha {
  titulo: string
  descricao: string
  probabilidade: number
  solucao: string
}

interface AnalysisResult {
  id: string
  device_model: string | null
  ios_version: string | null
  panic_type: string | null
  falha_1: Falha | null
  falha_2: Falha | null
  falha_3: Falha | null
}

export default function PanicAnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    if (f) {
      setFile(f)
      setError('')
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt', '.ips', '.panic', '.log'],
      'application/octet-stream': ['.ips', '.panic'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  async function handleAnalyze() {
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const content = await file.text()
      
      const response = await fetch('/api/panic-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          content,
          fileSize: file.size,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao analisar arquivo')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao processar arquivo')
    } finally {
      setLoading(false)
    }
  }

  function resetAnalysis() {
    setFile(null)
    setResult(null)
    setError('')
  }

  const probabilityColor = (prob: number) => {
    if (prob >= 80) return 'text-red-400'
    if (prob >= 50) return 'text-yellow-400'
    return 'text-green-400'
  }

  const probabilityBg = (prob: number) => {
    if (prob >= 80) return 'bg-red-500/20 border-red-500/30'
    if (prob >= 50) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-green-500/20 border-green-500/30'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-glab-neon-transparent.png"
              alt="G-LAB Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-white font-bold text-sm">G-LAB</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
            <Bug className="w-3 h-3" />
            Ferramenta de Diagnostico
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Analisador de Panic Log iOS
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Faca upload do arquivo .ips ou .panic e descubra as 3 possiveis causas do problema no dispositivo.
          </p>
        </div>

        {!result ? (
          <>
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-200
                ${isDragActive 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : file 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
                }
              `}
            >
              <input {...getInputProps()} />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-white font-medium mb-1">{file.name}</p>
                  <p className="text-zinc-500 text-sm">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                    }}
                    className="mt-4 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Trocar arquivo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-zinc-500" />
                  </div>
                  <p className="text-white font-medium mb-1">
                    {isDragActive ? 'Solte o arquivo aqui' : 'Arraste o arquivo ou clique para selecionar'}
                  </p>
                  <p className="text-zinc-500 text-sm">
                    Formatos aceitos: .ips, .panic, .txt, .log (max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-950/50 border border-red-900/50 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Analyze Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="
                  px-8 py-3 rounded-xl font-medium text-white
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:from-indigo-500 hover:to-purple-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 flex items-center gap-2
                "
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5" />
                    Analisar Arquivo
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="space-y-6">
              {/* Device Info */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  Informacoes do Dispositivo
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Modelo</p>
                    <p className="text-white font-medium">{result.device_model || 'Nao identificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">iOS</p>
                    <p className="text-white font-medium">{result.ios_version || 'Nao identificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Tipo de Panic</p>
                    <p className="text-white font-medium">{result.panic_type || 'Nao identificado'}</p>
                  </div>
                </div>
              </div>

              {/* Falhas */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Possiveis Causas
                </h2>
                <div className="space-y-4">
                  {[result.falha_1, result.falha_2, result.falha_3].map((falha, index) => falha && (
                    <div
                      key={index}
                      className={`rounded-2xl border p-6 ${probabilityBg(falha.probabilidade)}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </span>
                          <h3 className="text-white font-bold">{falha.titulo}</h3>
                        </div>
                        <span className={`text-sm font-bold ${probabilityColor(falha.probabilidade)}`}>
                          {falha.probabilidade}% probabilidade
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                        {falha.descricao}
                      </p>
                      <div className="bg-zinc-900/50 rounded-xl p-4">
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Solucao Recomendada</p>
                        <p className="text-indigo-300 text-sm">{falha.solucao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button
                  onClick={resetAnalysis}
                  className="px-6 py-3 rounded-xl font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Analisar Outro Arquivo
                </button>
                <Link
                  href="/cursos"
                  className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-center"
                >
                  Ver Cursos de Reparo
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Como funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
                <span className="text-indigo-400 font-bold">1</span>
              </div>
              <h3 className="text-white font-medium mb-1">Upload do arquivo</h3>
              <p className="text-zinc-500 text-sm">
                Faca upload do arquivo .ips ou .panic extraido do dispositivo iOS.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
                <span className="text-indigo-400 font-bold">2</span>
              </div>
              <h3 className="text-white font-medium mb-1">Analise automatica</h3>
              <p className="text-zinc-500 text-sm">
                Nossa IA analisa os padroes do log e identifica possiveis causas.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
                <span className="text-indigo-400 font-bold">3</span>
              </div>
              <h3 className="text-white font-medium mb-1">Diagnostico</h3>
              <p className="text-zinc-500 text-sm">
                Receba as 3 causas mais provaveis com solucoes recomendadas.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
