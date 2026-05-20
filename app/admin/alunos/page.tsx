"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Users, Search, Mail, Calendar, BookOpen } from "lucide-react"

type Profile = {
  id: string
  email: string
  nome: string | null
  telefone: string | null
  role: string
  created_at: string
}

type Purchase = {
  curso_id: string
  cursos: { titulo: string } | null
}

export default function AlunosPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [purchases, setPurchases] = useState<Record<string, Purchase[]>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    
    // Carregar profiles (alunos)
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .order("created_at", { ascending: false })

    if (profilesData) {
      setProfiles(profilesData)

      // Carregar compras de cada aluno
      const { data: purchasesData } = await supabase
        .from("purchases")
        .select("user_id, curso_id, cursos(titulo)")
        .eq("status", "approved")

      if (purchasesData) {
        const grouped: Record<string, Purchase[]> = {}
        purchasesData.forEach((p: { user_id: string; curso_id: string; cursos: { titulo: string } | null }) => {
          if (!grouped[p.user_id]) grouped[p.user_id] = []
          grouped[p.user_id].push({ curso_id: p.curso_id, cursos: p.cursos })
        })
        setPurchases(grouped)
      }
    }

    setLoading(false)
  }

  const filteredProfiles = profiles.filter(p => 
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.nome && p.nome.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3">
            <Users className="text-cyan" size={28} />
            Alunos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profiles.length} alunos cadastrados
          </p>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {search ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado ainda"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-cyan/20 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center text-cyan font-bold text-lg">
                  {profile.nome ? profile.nome.charAt(0).toUpperCase() : profile.email.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">
                    {profile.nome || "Sem nome"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {profile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                {/* Cursos */}
                <div className="flex flex-wrap gap-2">
                  {purchases[profile.id]?.length > 0 ? (
                    purchases[profile.id].map((p, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan/10 text-cyan text-xs font-medium"
                      >
                        <BookOpen size={12} />
                        {p.cursos?.titulo || "Curso"}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem cursos</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
