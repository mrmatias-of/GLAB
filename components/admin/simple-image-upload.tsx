"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ImageIcon, X, Upload } from "lucide-react"

interface SimpleImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export default function SimpleImageUpload({
  value,
  onChange,
}: SimpleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowed.includes(file.type)) {
      setError("Tipo não permitido. Use JPG, PNG, WebP ou GIF.")
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro no upload")
      }

      const data = await response.json()
      onChange(data.url)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-contain"
            sizes="100%"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 hover:bg-red-600 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}

      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex flex-col items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-sm text-slate-400">Enviando...</span>
            </>
          ) : (
            <>
              <Upload size={24} className="text-slate-400" />
              <span className="text-sm text-slate-400">
                Clique para enviar ou arraste uma imagem
              </span>
              <span className="text-xs text-slate-500">JPG, PNG, WebP ou GIF</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
