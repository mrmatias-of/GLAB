import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tenants, tenantBranding } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import postgres from 'postgres'

// GET /api/tenants - Listar tenants (apenas admin master)
export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth_session')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await db.select().from(tenants).limit(100)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Error fetching tenants:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tenants - Criar novo tenant
export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth_session')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, email, plan = 'free', ownerUserId } = body

    if (!name || !slug || !email || !ownerUserId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, email, ownerUserId' },
        { status: 400 }
      )
    }

    // Validar slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must be lowercase alphanumeric with hyphens only' },
        { status: 400 }
      )
    }

    // Verificar se slug já existe
    const existing = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, slug))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }

    const tenantId = randomUUID()
    
    // Criar banco de dados isolado para o tenant
    const masterDb = process.env.DATABASE_URL
    if (!masterDb) {
      throw new Error('DATABASE_URL not configured')
    }

    // Conectar ao master para criar novo banco
    const adminClient = postgres(masterDb)
    const dbName = `tenant_${slug.replace(/-/g, '_')}`

    try {
      // Criar novo banco de dados
      await adminClient`CREATE DATABASE ${adminClient(dbName)}`
      console.log(`[v0] Database created: ${dbName}`)

      // Construir URL do novo banco
      const tenantDbUrl = masterDb.replace(
        new URL(masterDb).pathname.slice(1),
        dbName
      )

      // Criar tenant no banco master
      await db.insert(tenants).values({
        id: tenantId,
        slug,
        name,
        email,
        databaseUrl: tenantDbUrl,
        databaseName: dbName,
        ownerUserId,
        plan,
      })

      // Criar branding padrão
      await db.insert(tenantBranding).values({
        id: randomUUID(),
        tenantId,
        primaryColor: '#3B82F6',
        secondaryColor: '#06B6D4',
        accentColor: '#10B981',
        backgroundColor: '#0B0F19',
        textColor: '#F1F5F9',
        theme: 'dark',
      })

      // Executar migrations no novo banco de dados
      // (As tabelas de tenant seguem o mesmo schema que o master)
      const tenantClient = postgres(tenantDbUrl)
      await tenantClient`
        CREATE TABLE IF NOT EXISTS "user" (
          "id" text PRIMARY KEY,
          "name" text NOT NULL,
          "email" text NOT NULL UNIQUE,
          "emailVerified" boolean NOT NULL DEFAULT false,
          "image" text,
          "createdAt" timestamp NOT NULL DEFAULT now(),
          "updatedAt" timestamp NOT NULL DEFAULT now()
        )
      `
      console.log(`[v0] Tables created in ${dbName}`)
      await tenantClient.end()

      return NextResponse.json(
        {
          success: true,
          tenant: {
            id: tenantId,
            slug,
            name,
            email,
            plan,
            status: 'active',
          },
        },
        { status: 201 }
      )
    } catch (dbError) {
      console.error('[v0] Database creation error:', dbError)
      // Limpar se criou o banco mas falhou na inserção
      try {
        await adminClient`DROP DATABASE IF EXISTS ${adminClient(dbName)}`
      } catch (e) {
        console.error('[v0] Cleanup error:', e)
      }
      throw dbError
    } finally {
      await adminClient.end()
    }
  } catch (error) {
    console.error('[v0] Error creating tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
