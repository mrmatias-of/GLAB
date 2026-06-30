import { create } from 'zustand'

interface AuthState {
  token: string | null
  user: any
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: async (email, password) => {
    // Mock login - replace with actual API call
    set({ token: 'mock-token', user: { email } })
  },
  logout: () => set({ token: null, user: null }),
  setToken: (token) => set({ token }),
}))
