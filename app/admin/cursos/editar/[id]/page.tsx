import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import CursoForm from "@/components/admin/curso-form"

export default async function EditarCursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Buscar curso do MySQL via Prisma
  const curso = await prisma.cursos.findUnique({
    where: { id: parseInt(id) },
  })

  if (!curso) notFound()

  return <CursoForm initialData={curso} id={id} />
}
