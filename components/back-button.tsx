"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-white/50 hover:text-blue-400 transition-colors text-sm mb-8 group"
    >
      <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
      Voltar
    </button>
  )
}
