"use client"

import { useState, useRef, useCallback } from "react"
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import Image from "next/image"
import { ImageIcon, X, RotateCcw, Check, Upload } from "lucide-react"

interface ImageCropUploadProps {
  value: string
  onChange: (url: string) => void
  aspectRatio?: number | undefined // ex: 16/9, 4/3, 1. Undefined = livre
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  )
}

async function getCroppedBlob(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> {
  const canvas = document.createElement("canvas")
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = crop.width
  canvas.height = crop.height

  const ctx = canvas.getContext("2d")!
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Erro ao gerar blob"))
        resolve(new File([blob], fileName, { type: "image/jpeg" }))
      },
      "image/jpeg",
      0.92
    )
  })
}

export default function ImageCropUpload({
  value,
  onChange,
  aspectRatio,
}: ImageCropUploadProps) {
  const [srcImage, setSrcImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const originalFileName = useRef<string>("capa.jpg")

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowed.includes(file.type)) {
      setError("Tipo não permitido. Use JPG, PNG, WebP ou GIF.")
      return
    }

    setError(null)
    originalFileName.current = file.name
    const reader = new FileReader()
    reader.onload = () => setSrcImage(reader.result as string)
    reader.readAsDataURL(file)
    // Limpa o input para permitir re-upload do mesmo arquivo
    e.target.value = ""
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspectRatio))
  }

  async function handleConfirmCrop() {
    if (!imgRef.current || !completedCrop) return
    setUploading(true)
    setError(null)

    try {
      const croppedFile = await getCroppedBlob(imgRef.current, completedCrop, originalFileName.current)
      const formData = new FormData()
      formData.append("file", croppedFile)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Erro no upload")

      onChange(data.url)
      setSrcImage(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload")
    } finally {
      setUploading(false)
    }
  }

  function handleCancel() {
    setSrcImage(null)
    setCrop(undefined)
    setCompletedCrop(undefined)
    setError(null)
  }

  function handleRemove() {
    onChange("")
    setSrcImage(null)
    setCrop(undefined)
    setCompletedCrop(undefined)
  }

  // --- Estado: tem imagem salva ---
  if (value && !srcImage) {
    return (
      <div className="relative">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-background">
          <Image src={value} alt="Capa do curso" fill className="object-cover" />
        </div>
        <div className="flex gap-2 mt-3">
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue/30 bg-blue-600/5 text-xs font-medium text-blue-600 hover:bg-blue/10 cursor-pointer transition-all">
            <Upload size={13} />
            Trocar imagem
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onSelectFile} className="hidden" />
          </label>
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/20 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <X size={13} />
            Remover
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 truncate">{value}</p>
      </div>
    )
  }

  // --- Estado: selecionou imagem, exibe crop ---
  if (srcImage) {
    return (
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-foreground">Recortar imagem</p>
          <button type="button" onClick={handleCancel} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="flex justify-center bg-black/30 rounded-lg overflow-hidden border border-blue/20">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            minWidth={50}
            minHeight={50}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={srcImage}
              alt="Para recortar"
              onLoad={onImageLoad}
              style={{ maxHeight: "400px", maxWidth: "100%", display: "block" }}
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>

        <p className="text-[10px] text-muted-foreground text-center bg-blue-600/5 border border-blue/20 rounded px-2 py-1.5">
          Arraste para reposicionar o recorte. Sem restrição de proporção.
        </p>

        {error && (
          <p className="text-xs text-red-400 text-center bg-red-500/5 border border-red-500/20 rounded px-2 py-1.5">{error}</p>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
          >
            <RotateCcw size={12} />
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            disabled={uploading || !completedCrop}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-background text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue/90 transition-all"
            style={{ color: "#050510" }}
          >
            {uploading ? (
              <>
                <div className="w-3 h-3 border border-background border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Check size={13} />
                Confirmar e salvar
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  // --- Estado: sem imagem, exibe zona de upload ---
  return (
    <div>
      <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border hover:border-blue/50 bg-background cursor-pointer transition-all group">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onSelectFile}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue/20 flex items-center justify-center group-hover:bg-blue/20 transition-colors">
            <ImageIcon size={24} className="text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Clique para fazer upload</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP ou GIF</p>
          </div>
        </div>
      </label>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  )
}
