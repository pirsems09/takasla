import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  login: (token: string) => set({ isAuthenticated: true, token }),
  logout: () => set({ isAuthenticated: false }),
}));
