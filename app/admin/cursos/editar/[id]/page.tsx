import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CursoForm from "@/components/admin/curso-form"

export default async function EditarCursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: curso } = await supabase.from("cursos").select("*").eq("id", id).single()

  if (!curso) notFound()

  return <CursoForm initialData={curso} id={id} />
}
