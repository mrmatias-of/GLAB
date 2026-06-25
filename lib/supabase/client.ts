// Deprecated: Migrated to MySQL + JWT
// This file is kept for backward compatibility only

export function createClient() {
  console.warn('[v0] Supabase client is deprecated. Using stub implementation.')
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error('Deprecated') }),
      signOut: async () => {},
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }) }) }),
    }),
  }
}
