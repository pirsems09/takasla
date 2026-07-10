import { create } from "zustand";
import {
  fetchListings as apiFetchListings,
  fetchListingById as apiFetchById,
  fetchListingsByOwner as apiFetchByOwner,
  createListing as apiCreate,
  updateListing as apiUpdate,
  deleteListing as apiDelete,
  uploadListingImage as apiUpload,
  type ListingFilters,
  type CreateListingPayload,
} from "@api/listingService";
import type { Product } from "@api/types";

/**
 * Listing store — async server-state pattern.
 *
 * `{ data, loading, error, lastFetch }` üçlüsü ekranlarda skeleton/hata
 * gösterimi için standart hale getirir. `detail` tekil ilanları cache'ler.
 * Ekranlar `useListingStore((s) => s.listings)` ile veriyi seçer.
 */
type ListingState = {
  listings: Product[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  detail: Record<string, Product>;
  fetchListings: (filters?: ListingFilters) => Promise<void>;
  fetchListingById: (id: string) => Promise<Product | null>;
  fetchListingsByOwner: (ownerId: string) => Promise<Product[]>;
  createListing: (payload: CreateListingPayload) => Promise<Product>;
  updateListing: (id: string, updates: Partial<CreateListingPayload>) => Promise<Product>;
  deleteListing: (id: string) => Promise<void>;
  uploadImage: (uri: string) => Promise<string>;
  clearError: () => void;
};

const toMessage = (e: unknown): string =>
  e instanceof Error ? e.message : "Beklenmeyen bir hata oluştu.";

export const useListingStore = create<ListingState>((set, get) => ({
  listings: [],
  loading: false,
  error: null,
  lastFetch: null,
  detail: {},

  fetchListings: async (filters) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetchListings(filters);
      console.log('[listingStore] fetchListings: success, count:', data.length);
      set({ listings: data, loading: false, lastFetch: Date.now() });
    } catch (e) {
      set({ loading: false, error: toMessage(e) });
    }
  },

  fetchListingById: async (id) => {
    const cached = get().detail[id];
    if (cached) {
      console.log('[listingStore] fetchListingById: from cache, id:', id);
      return cached;
    }
    try {
      const product = await apiFetchById(id);
      if (product) {
        set((state) => ({ detail: { ...state.detail, [id]: product } }));
      }
      console.log('[listingStore] fetchListingById: success, id:', id, 'found:', !!product);
      return product;
    } catch (e) {
      set({ error: toMessage(e) });
      return null;
    }
  },

  fetchListingsByOwner: async (ownerId) => {
    try {
      const products = await apiFetchByOwner(ownerId);
      console.log('[listingStore] fetchListingsByOwner: success, ownerId:', ownerId, 'count:', products.length);
      return products;
    } catch (e) {
      set({ error: toMessage(e) });
      return [];
    }
  },

  createListing: async (payload) => {
    set({ loading: true, error: null });
    try {
      const product = await apiCreate(payload);
      console.log('[listingStore] createListing: success, id:', product.id);
      set((state) => ({
        listings: [product, ...state.listings],
        detail: { ...state.detail, [product.id]: product },
        loading: false,
      }));
      return product;
    } catch (e) {
      set({ loading: false, error: toMessage(e) });
      throw e;
    }
  },

  updateListing: async (id, updates) => {
    try {
      const product = await apiUpdate(id, updates);
      console.log('[listingStore] updateListing: success, id:', id);
      set((state) => ({
        listings: state.listings.map((l) => (l.id === id ? product : l)),
        detail: { ...state.detail, [id]: product },
      }));
      return product;
    } catch (e) {
      set({ error: toMessage(e) });
      throw e;
    }
  },

  deleteListing: async (id) => {
    try {
      await apiDelete(id);
      console.log('[listingStore] deleteListing: success, id:', id);
      set((state) => {
        const listings = state.listings.filter((l) => l.id !== id);
        const detail = { ...state.detail };
        delete detail[id];
        return { listings, detail };
      });
    } catch (e) {
      set({ error: toMessage(e) });
      throw e;
    }
  },

  uploadImage: async (uri) => {
    try {
      const url = await apiUpload(uri);
      console.log('[listingStore] uploadImage: success, uri:', uri);
      return url;
    } catch (e) {
      set({ error: toMessage(e) });
      throw e;
    }
  },

  clearError: () => set({ error: null }),
}));