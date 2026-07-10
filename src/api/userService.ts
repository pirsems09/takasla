import { supabase } from '@lib/supabase';
import { mapProfile, type ProfileRow, type UserProfile } from './types';

export type { UserProfile };

export type SignUpPayload = { email: string; password: string; name?: string };
export type SignInPayload = { email: string; password: string };

/** Yeni kullanıcı oluştur (email + şifre). Profil trigger ile otomatik açılır.
 *
 * DİKKAT: Supabase default olarak "Confirm email" açıktır. Bu durumda signUp
 * başarılı olur (kullanıcı auth.users'a eklenir + profil trigger'ı çalışır)
 * ama `session` null döner — kullanıcı email doğrulaması yapana kadar oturum
 * açamaz. Geliştirme sırasında direkt giriş için Dashboard > Authentication >
 * Providers > Email > "Confirm email" toggle'ını kapatın.
 */
export const signUp = async (payload: SignUpPayload) => {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: { data: { name: payload.name ?? '' } },
  });
  if (error) throw error;
  console.log('[userService] signUp: success, email:', payload.email);
  return data;
};

/** Email + şifre ile giriş. */
export const signIn = async (payload: SignInPayload) => {
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  if (error) throw error;
  console.log('[userService] signIn: success, email:', payload.email);
  return data;
};

/** Oturumu kapat. */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  console.log('[userService] signOut: success');
};

/** Mevcut Supabase oturumunu döndürür (yoksa null). */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  console.log('[userService] getSession: success, hasSession:', !!data.session);
  return data.session;
};

/** Giriş yapmış kullanıcının profilini getirir (yoksa null). */
export const getProfile = async (): Promise<UserProfile | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log('[userService] getProfile: no user');
    return null;
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) throw error;
  console.log('[userService] getProfile: success, userId:', user.id);
  return mapProfile(data as ProfileRow);
};

/** Giriş yapmış kullanıcının profil alanlarını günceller. */
export const updateProfile = async (
  updates: Partial<Pick<UserProfile, 'name' | 'avatar'>>
): Promise<UserProfile> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Oturum yok.');
  const patch: Partial<ProfileRow> = {};
  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.avatar !== undefined) patch.avatar = updates.avatar;
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', user.id)
    .select()
    .single();
  if (error) throw error;
  console.log('[userService] updateProfile: success, userId:', user.id);
  return mapProfile(data as ProfileRow);
};

