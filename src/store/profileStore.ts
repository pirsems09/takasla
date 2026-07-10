import { create } from "zustand";
import {
  getProfile as apiGetProfile,
  updateProfile as apiUpdateProfile,
} from "@api/userService";
import type { UserProfile } from "@api/types";

/**
 * Profile store — async server-state pattern.
 * Giriş yapmış kullanıcının profilini çeker/günceller.
 */
type ProfileState = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, "name" | "avatar">>) => Promise<void>;
  clearProfile: () => void;
  clearError: () => void;
};

const toMessage = (e: unknown): string =>
  e instanceof Error ? e.message : "Beklenmeyen bir hata oluştu.";

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await apiGetProfile();
      console.log('[profileStore] fetchProfile: success, hasProfile:', !!profile);
      set({ profile, loading: false });
    } catch (e) {
      set({ loading: false, error: toMessage(e) });
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const profile = await apiUpdateProfile(updates);
      console.log('[profileStore] updateProfile: success');
      set({ profile, loading: false });
    } catch (e) {
      set({ loading: false, error: toMessage(e) });
      throw e;
    }
  },

  clearProfile: () => set({ profile: null, loading: false, error: null }),

  clearError: () => set({ error: null }),
}));