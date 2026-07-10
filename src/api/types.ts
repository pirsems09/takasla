import { supabase } from '@lib/supabase';

/**
 * Takasla — paylaşılan domain tipleri, DB satır tipleri ve mapper'lar.
 *
 * - Domain tipleri (camelCase): uygulamanın gördüğü tipler; `mockData` ile
 *   birebir uyumludur (Product / Thread / Message / UserProfile).
 * - Row tipleri (snake_case): Supabase'den dönen ham satırlar.
 * - Mapper'lar: row -> domain dönüşümü. Service katmanı bunları kullanır,
 *   böylece ekranlar DB yapısını bilmez.
 */

// ── Domain tipleri (camelCase) ────────────────────────────────────────────────
export type ListingType = 'sell' | 'swap' | 'donate';

export type Product = {
  id: string;
  title: string;
  price: string;
  currency: string;
  image: string;
  images?: string[];
  badge?: string;
  tags: string[];
  size?: string;
  heelHeight?: string;
  width?: string;
  description: string;
  category?: string;
  condition?: string;
  priceMin?: string;
  priceMax?: string;
  address?: string;
  listingType?: ListingType;
  rating?: number;
  distance?: string;
  // backend'e özel ek alanlar (mock veride kullanılmaz)
  ownerId?: string;
  status?: string;
  createdAt?: string;
};

export type Thread = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  productId?: string;
};

export type Message = {
  id: string;
  from: 'me' | 'seller';
  text: string;
  time: string;
  previewImage?: string;
  threadId: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  swapCount: number;
  impact: number;
  joinedAt: string;
};

// ── DB row tipleri (snake_case — Supabase ham satır) ──────────────────────────
export type ListingRow = {
  id: string;
  owner_id: string;
  title: string;
  price: string;
  currency: string;
  image_url: string | null;
  image_urls: string[] | null;
  badge: string | null;
  tags: string[] | null;
  size: string | null;
  heel_height: string | null;
  width: string | null;
  description: string;
  category: string | null;
  condition: string | null;
  price_min: string | null;
  price_max: string | null;
  address: string | null;
  listing_type: ListingType;
  rating: number | null;
  distance: string | null;
  status: string;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  rating: number;
  swap_count: number;
  impact: number;
  joined_at: string;
};

export type ThreadRow = {
  id: string;
  participant_a: string;
  participant_b: string;
  listing_id: string | null;
  last_message: string | null;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  thread_id: string;
  sender_id: string;
  text: string | null;
  image_url: string | null;
  created_at: string;
};

export type FavoriteRow = {
  user_id: string;
  listing_id: string;
  created_at: string;
};

// ── Yardımcı: ISO timestamp -> "HH:mm" ────────────────────────────────────────
export const formatTime = (iso: string): string => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

// ── Mapper'lar ─────────────────────────────────────────────────────────────────
export const mapListing = (row: ListingRow): Product => ({
  id: row.id,
  title: row.title,
  price: row.price,
  currency: row.currency,
  image: row.image_url ?? '',
  images: row.image_urls ?? undefined,
  badge: row.badge ?? undefined,
  tags: row.tags ?? [],
  size: row.size ?? undefined,
  heelHeight: row.heel_height ?? undefined,
  width: row.width ?? undefined,
  description: row.description,
  category: row.category ?? undefined,
  condition: row.condition ?? undefined,
  priceMin: row.price_min ?? undefined,
  priceMax: row.price_max ?? undefined,
  address: row.address ?? undefined,
  listingType: row.listing_type,
  rating: row.rating ?? undefined,
  distance: row.distance ?? undefined,
  ownerId: row.owner_id,
  status: row.status,
  createdAt: row.created_at,
});

export const mapProfile = (row: ProfileRow): UserProfile => ({
  id: row.id,
  name: row.name,
  email: row.email,
  avatar: row.avatar ?? undefined,
  rating: row.rating,
  swapCount: row.swap_count,
  impact: row.impact,
  joinedAt: row.joined_at,
});

export const mapThread = (row: ThreadRow, otherParticipant: ProfileRow): Thread => ({
  id: row.id,
  name: otherParticipant.name,
  avatar: otherParticipant.avatar ?? '',
  lastMessage: row.last_message ?? '',
  time: formatTime(row.updated_at),
  productId: row.listing_id ?? undefined,
});

export const mapMessage = (row: MessageRow, currentUserId: string): Message => ({
  id: row.id,
  from: row.sender_id === currentUserId ? 'me' : 'seller',
  text: row.text ?? '',
  time: formatTime(row.created_at),
  previewImage: row.image_url ?? undefined,
  threadId: row.thread_id,
});

// ── Auth yardımcı: Supabase client'i store'lar dışından da kullanmak için ──────
export { supabase };
