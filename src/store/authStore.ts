import { create } from "zustand";
import type { Session } from '@supabase/supabase-js';
import { supabase } from "@lib/supabase";
import {
  signIn as apiSignIn,
  signUp as apiSignUp,
  signOut as apiSignOut,
} from "@api/userService";

/**
 * Auth store — Supabase session tabanlı.
 *
 * Supabase kendi oturumunu AsyncStorage'da persist eder (bkz. @lib/supabase),
 * bu yüzden burada manuel token saklamaya gerek yok. Bu store yalnızca
 * UI'ın kolay erişmesi için session'dan türetilmiş isAuthenticated/userId/email
 * tutar ve auth aksiyonlarını service katmanına yönlendirir.
 *
 * `checkAuth` ilk çağrılda `onAuthStateChange` dinleyicisini kurar; böylece
 * oturum yenileme / sonlanma otomatik olarak state'e yansır.
 */
type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  isReady: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

let listenerInitialized = false;

const sessionToState = (session: Session | null): Partial<AuthState> =>
  session?.user
    ? {
        isAuthenticated: true,
        userId: session.user.id,
        email: session.user.email ?? null,
      }
    : { isAuthenticated: false, userId: null, email: null };

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  email: null,
  isReady: false,

  signUp: async (email, password, name) => {
    const result = await apiSignUp({ email, password, name });
    // Supabase "Confirm email" açıksa signUp başarılı olur ama session null döner.
    // Bu durumda kullanıcı email doğrulaması yapana kadar oturum açamaz.
    // Anlamlı bir hata fırlat ki AuthScreen Alert gösterebilsin.
    if (!result.session) {
      throw new Error(
        'Kayıt başarılı! E-posta doğrulama gerekiyor — mailini kontrol et, ' +
        'doğrulama linkine tıkla sonra "Giriş Yap" ile devam et. ' +
        '(Geliştirme: Dashboard > Authentication > Providers > Email > ' +
        '"Confirm email" kapatılırsa direkt giriş olur.)'
      );
    }
    const { data } = await supabase.auth.getSession();
    console.log('[authStore] signUp: session updated');
    set(sessionToState(data.session));
  },

  signIn: async (email, password) => {
    await apiSignIn({ email, password });
    const { data } = await supabase.auth.getSession();
    console.log('[authStore] signIn: session updated, userId:', data.session?.user?.id);
    set(sessionToState(data.session));
  },

  logout: async () => {
    await apiSignOut();
    console.log('[authStore] logout: session cleared');
    set(sessionToState(null));
    // onAuthStateChange SIGNED_OUT da tetiklenecek, ancak UI'ın anında
    // temizlenmesi için store'ları burada da resetleyelim (idempotent).
    try {
      const { useChatStore } = await import('./chatStore');
      const { useProfileStore } = await import('./profileStore');
      useChatStore.getState().reset();
      useProfileStore.getState().clearProfile();
    } catch (e) {
      // store'lar henüz yüklenmemiş olabilir — önemli değil
    }
  },

  checkAuth: async () => {
    if (!listenerInitialized) {
      listenerInitialized = true;
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('[authStore] onAuthStateChange: event:', event, 'hasSession:', !!session);
        set(sessionToState(session));
        if (event === 'SIGNED_OUT') {
          // Çıkışta diğer store'ların sunucu state'ini temizle (veri sızıntısı
          // önlemek: A çıkış → B giriş yaparsa A'nın verisi görünmemeli).
          try {
            const { useChatStore } = await import('./chatStore');
            const { useProfileStore } = await import('./profileStore');
            useChatStore.getState().reset();
            useProfileStore.getState().clearProfile();
          } catch (e) {
            // yoksay
          }
        } else if (event === 'SIGNED_IN') {
          // Girişte sunucudaki favorileri yerel ile birleştir (çapraz cihaz).
          try {
            const { useFavoriteStore } = await import('./favoriteStore');
            useFavoriteStore.getState().syncFromServer();
          } catch (e) {
            // yoksay
          }
        }
      });
    }
    const { data } = await supabase.auth.getSession();
    console.log('[authStore] checkAuth: hasSession:', !!data.session);
    set(sessionToState(data.session));
    set({ isReady: true });
  },
}));

