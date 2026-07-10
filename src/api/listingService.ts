import { supabase } from '@lib/supabase';
import { mapListing, type ListingRow, type Product, type ListingType } from './types';

export type ListingFilters = {
  listingType?: ListingType;
  category?: string;
  search?: string;
};

export type CreateListingPayload = {
  title: string;
  price: string;
  currency?: string;
  imageUrls: string[];
  badge?: string;
  tags?: string[];
  size?: string;
  heelHeight?: string;
  width?: string;
  description?: string;
  category?: string;
  condition?: string;
  priceMin?: string;
  priceMax?: string;
  address?: string;
  listingType?: ListingType;
  rating?: number;
  distance?: string;
};

/** Aktif ilanlari getirir (filtreler opsiyonel). */
export const fetchListings = async (filters?: ListingFilters): Promise<Product[]> => {
  let query = supabase.from('listings').select('*').eq('status', 'active');
  if (filters?.listingType) query = query.eq('listing_type', filters.listingType);
  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`);
  query = query.order('created_at', { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  console.log('[listingService] fetchListings: success, count:', (data as ListingRow[]).length);
  return (data as ListingRow[]).map(mapListing);
};

/** Tek bir ilani id ile getirir (yoksa null). */
export const fetchListingById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    // PGRST116: tek satir beklenip bulunamadi
    if (error.code === 'PGRST116') {
      console.log('[listingService] fetchListingById: not found, id:', id);
      return null;
    }
    throw error;
  }
  console.log('[listingService] fetchListingById: success, id:', id);
  return mapListing(data as ListingRow);
};

/** Bir kullanicinin kendi ilanlarini getirir. */
export const fetchListingsByOwner = async (ownerId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  console.log('[listingService] fetchListingsByOwner: success, ownerId:', ownerId, 'count:', (data as ListingRow[]).length);
  return (data as ListingRow[]).map(mapListing);
};

/** Yeni ilan olusturur (giris yapmis kullanici icin). */
export const createListing = async (payload: CreateListingPayload): Promise<Product> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('ilan olusturmak icin giris yapmalisiniz.');
  const insert: Partial<ListingRow> = {
    owner_id: user.id,
    title: payload.title,
    price: payload.price,
    currency: payload.currency ?? '$',
    image_url: payload.imageUrls[0] ?? null,
    image_urls: payload.imageUrls,
    badge: payload.badge ?? null,
    tags: payload.tags ?? [],
    size: payload.size ?? null,
    heel_height: payload.heelHeight ?? null,
    width: payload.width ?? null,
    description: payload.description ?? '',
    category: payload.category ?? null,
    condition: payload.condition ?? null,
    price_min: payload.priceMin ?? null,
    price_max: payload.priceMax ?? null,
    address: payload.address ?? null,
    listing_type: payload.listingType ?? 'sell',
    rating: payload.rating ?? null,
    distance: payload.distance ?? null,
  };
  const { data, error } = await supabase
    .from('listings')
    .insert(insert)
    .select()
    .single();
  if (error) throw error;
  console.log('[listingService] createListing: success, id:', (data as ListingRow).id);
  return mapListing(data as ListingRow);
};

/** ilan gunceller (sadece kendi ilani -- RLS garantiler). */
export const updateListing = async (
  id: string,
  updates: Partial<CreateListingPayload>
): Promise<Product> => {
  const patch: Partial<ListingRow> = {};
  if (updates.title !== undefined) patch.title = updates.title;
  if (updates.price !== undefined) patch.price = updates.price;
  if (updates.currency !== undefined) patch.currency = updates.currency;
  if (updates.imageUrls !== undefined) {
    patch.image_urls = updates.imageUrls;
    patch.image_url = updates.imageUrls[0] ?? null;
  }
  if (updates.description !== undefined) patch.description = updates.description;
  if (updates.category !== undefined) patch.category = updates.category;
  if (updates.condition !== undefined) patch.condition = updates.condition;
  if (updates.listingType !== undefined) patch.listing_type = updates.listingType;
  if (updates.address !== undefined) patch.address = updates.address;
  if (updates.priceMin !== undefined) patch.price_min = updates.priceMin;
  if (updates.priceMax !== undefined) patch.price_max = updates.priceMax;
  const { data, error } = await supabase
    .from('listings')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  console.log('[listingService] updateListing: success, id:', id);
  return mapListing(data as ListingRow);
};

/** ilan siler (sadece kendi ilani -- RLS garantiler). */
export const deleteListing = async (id: string): Promise<void> => {
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw error;
  console.log('[listingService] deleteListing: success, id:', id);
};

/** ilan fotografini Storage'a yukler ve public URL dondurur. */
export const uploadListingImage = async (uri: string): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('fotograf yuklemek icin giris yapmalisiniz.');
  const ext =
    uri
      .split('.')
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '') || 'jpg';
  const fileName = `${user.id}/${Date.now()}.${ext}`;
  const response = await fetch(uri);
  const blob = await response.blob();
  const { error } = await supabase.storage
    .from('listing-images')
    .upload(fileName, blob, { contentType: blob.type || 'image/jpeg' });
  if (error) throw error;
  console.log('[listingService] uploadListingImage: success, fileName:', fileName);
  const { data } = supabase.storage.from('listing-images').getPublicUrl(fileName);
  return data.publicUrl;
};
