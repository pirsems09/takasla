import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

/**
 * Supabase client — uygulamanın tek backend girişi.
 *
 * `.env` dosyasındaki SUPABASE_URL / SUPABASE_ANON_KEY değerleri
 * `react-native-dotenv` (babel) ile build sırasında buraya enjekte edilir.
 *
 * `auth.storage` olarak AsyncStorage verilir; böylece Supabase session'ı
 * cihazda persist edilir (uygulama kapanıp açıldığında oturum korunur).
 *
 * `detectSessionInUrl: false` — React Native'de browser URL flow'u yoktur.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
