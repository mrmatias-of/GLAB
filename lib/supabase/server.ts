// Deprecated: Migrated to MySQL + JWT
// This file is kept for backward compatibility only

export async function createClient() {
  console.warn('[v0] Supabase server client is deprecated. Using stub implementation.')
  const stubBuilder = {
    select: () => stubBuilder,
    eq: () => stubBuilder,
    order: () => ({ data: [], error: null }),
  }
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error('Deprecated') }),
      signOut: async () => {},
    },
    from: () => stubBuilder,
  }
}
