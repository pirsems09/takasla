import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchFavoriteIds, addFavorite, removeFavorite } from "@api/favoriteService";
import { useAuthStore } from "./authStore";

/**
 * Favorite store — HİBRİT (offline-first + server sync).
 *
 * - `favoriteIds` AsyncStorage'da persist edilir → favori anlık UI yanıt verir,
 *   internet olmasa bile çalışır.
 * - `toggleFavorite` önce yerel state'i optimistik günceller, ardından giriş
 *   yapılmışsa sunucuya best-effort yazar.
 * - `syncFromServer` giriş yapınca sunucudaki favorilerle yereli birleştirir
 *   (çapraz cihaz tutarlılığı).
 */
type FavoriteState = {
  favoriteIds: Record<string, boolean>;
  isSyncing: boolean;
  syncError: string | null;
};

type FavoriteActions = {
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  syncFromServer: () => Promise<void>;
};

export const useFavoriteStore = create<FavoriteState & FavoriteActions>()(
  persist(
    (set, get) => ({
      favoriteIds: {},
      isSyncing: false,
      syncError: null,

      toggleFavorite: (id: string) => {
        const wasFav = !!get().favoriteIds[id];
        // 1) Optimistik yerel güncelleme (anlık UI)
        set((state) => {
          const updated = { ...state.favoriteIds };
          if (updated[id]) {
            delete updated[id];
          } else {
            updated[id] = true;
          }
          return { favoriteIds: updated };
        });
        // 2) Giriş yapılmışsa sunucuya best-effort yaz
        if (!useAuthStore.getState().isAuthenticated) return;
        if (wasFav) {
          removeFavorite(id).catch((e) => console.warn("Favori silinemedi:", e));
        } else {
          addFavorite(id).catch((e) => console.warn("Favori eklenemedi:", e));
        }
      },

      isFavorite: (id: string) => !!get().favoriteIds[id],

      syncFromServer: async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        set({ isSyncing: true, syncError: null });
        try {
          const serverIds = await fetchFavoriteIds();
          // birleştir: yerel (henüz sync olmamış) + sunucu
          set((state) => ({
            favoriteIds: { ...serverIds, ...state.favoriteIds },
            isSyncing: false,
          }));
          console.log('[favoriteStore] syncFromServer: success, count:', Object.keys(serverIds).length);
        } catch (e) {
          set({ isSyncing: false, syncError: "Favoriler yüklenemedi." });
          console.error('[favoriteStore] syncFromServer: error', e);
        }
      },
    }),
    {
      name: "@takasla:favorites",
      storage: createJSONStorage(() => AsyncStorage),
      // sadece favoriteIds persist edilir; transient alanlar hariç
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    }
  )
);

