import { supabase } from '@lib/supabase';

type FavoriteRow = { listing_id: string };

/** Giriş yapmış kullanıcının favori ilan id'lerini Record olarak döndürür. */
export const fetchFavoriteIds = async (): Promise<Record<string, boolean>> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log('[favoriteService] fetchFavoriteIds: no user, returning {}');
    return {};
  }
  const { data, error } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', user.id);
  if (error) throw error;
  const map: Record<string, boolean> = {};
  (data as FavoriteRow[]).forEach((f) => {
    map[f.listing_id] = true;
  });
  console.log('[favoriteService] fetchFavoriteIds: success, count:', Object.keys(map).length);
  return map;
};

/** Bir ilanı favorilere ekler (giriş yapmış kullanıcı). */
export const addFavorite = async (listingId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Favori eklemek için giriş yapmalısınız.');
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: user.id, listing_id: listingId });
  if (error) throw error;
  console.log('[favoriteService] addFavorite: success, listingId:', listingId);
};

/** Bir ilanı favorilerden çıkarır (giriş yapmış kullanıcı). */
export const removeFavorite = async (listingId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Favori çıkarmak için giriş yapmalısınız.');
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('listing_id', listingId);
  if (error) throw error;
  console.log('[favoriteService] removeFavorite: success, listingId:', listingId);
};
