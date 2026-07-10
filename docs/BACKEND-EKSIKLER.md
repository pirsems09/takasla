# Takasla — Eksiklik Analizi & Uygulama Planı

> Backend (Supabase) entegrasyonu mimari olarak tamamlandı: `lib/supabase.ts`,
> `api/*Service.ts`, `store/*Store.ts`, `supabase/schema.sql`, `.env`, babel/tsconfig
> alias'ları hepsi yerinde ve `npx tsc --noEmit` hatasız geçiyor.
> Aşağıdaki maddeler, uygulamanın **çalışır ama kullanıcı tarafından kullanılamaz**
> durumda kalmasına neden olan açık uçlardır. Önem sırasına göre listelenmiştir.

> ✅ **GÜNCELLEME (7 Tem 2026):** Aşağıdaki TÜM maddeler 1–8 uygulandı.
> Uygulama artık tam fonksiyonel: giriş/kayıt/çıkış akışı, satıcıya mesaj,
> logout cleanup, favori sync, CreateListing ön kontrolü tamamlandı.
> `npx tsc --noEmit` → hatasız. Madde 9–11 opsiyonel/ileri seviye bırakıldı.

---

## 🔴 KRİTİK — Uygulama fonksiyonel değil (kullanıcı akışı kopuk)

### 1. Login / Signup ekranı YOK
- **Durum:** `authStore`'da `signIn` / `signUp` / `logout` aksiyonları ve `userService`
  'te `signUp` / `signIn` / `signOut` fonksiyonları hazır, ama **hiçbir ekrandan
  çağrılmıyorlar.** `RootNavigator` intro sonrası direkt `MainTabs`'a atlıyor.
- **Sonuç:** Kullanıcı giriş yapamaz → ilan ekleyemez (RLS `owner_id = auth.uid()`
  gerektirir), sohbet açamaz (`sender_id = auth.uid()`), favorileri sunucuya
  senkronize edemez, profilini göremez. Backend var ama erişilemez.
- **Çözüm:**
  1. `src/screens/AuthScreen.tsx` oluştur — email/şifre + isim alanları,
     "Giriş Yap" / "Kayıt Ol" toggle, `useAuthStore.signIn/signUp` çağrısı,
     hata gösterimi (`try/catch` → Alert).
  2. `src/navigation/types.ts` → `RootStackParamList`'e `Auth: undefined` ekle.
  3. `RootNavigator.tsx`'te `isAuthenticated` false ise `Auth` ekranını göster
     (intro sonrası, MainTabs öncesi).
  4. `authStore.isReady`'yi `RootNavigator` yükleme kapısında kullan (şu an
     kullanılmıyor — bkz. madde 5).

### 2. Logout butonu YOK
- **Durum:** `useAuthStore.logout()` hiçbir ekrandan çağrılmıyor (arama: yalnızca
  `BACKEND.md`'de geçiyor). `ProfileScreen` `isAuthenticated`'i okuyor ama giriş
  yapılmamışsa sadece `fetchProfile`'ı atlıyor; **"Giriş Yap" / "Çıkış Yap" butonu
  yok.** Giriş yapmadan da "Sarah Jenkins" fallback profili gösteriliyor.
- **Sonuç:** Kullanıcı çıkış yapamaz; giriş yapmamışken sahte profil görür.
- **Çözüm:** `ProfileScreen.tsx`'te `isAuthenticated` false ise "Giriş Yap" CTA
  kartı göster (→ `navigation.navigate('Auth')`); true ise mevcut profil + en alta
  "Çıkış Yap" butonu → `useAuthStore.logout()` (+ `chatStore.reset()` +
  `profileStore` temizliği — bkz. madde 4).

### 3. ProductDetail → Chat akışı BOZUK (sahte thread id)
- **Durum:** `ProductDetailScreen.goChat()`:
  `const threadId = sellerThread?.id ?? \`thread-${product.id}\`;`
  Thread bulunamazsa **uydurma** `thread-${product.id}` id'siyle Chat ekranına
  gidiyor. Bu id DB'de yok → `fetchMessages` boş döner, `sendMessage` RLS hatası
  atar. Oysa `chatService.getOrCreateThread(otherUserId, listingId)` hazır ama
  **hiç çağrılmıyor.**
- **Ek sorun:** Satıcı adı/avatarı sahte (`'Takasla Seller'` / `product.image`);
  `product.ownerId` var ama kullanılmıyor — gerçek satıcı profili fetch edilmiyor.
- **Çözüm:**
  1. `goChat`'ı async yap: giriş kontrolü → `getOrCreateThread(product.ownerId,
     product.id)` → gerçek thread id ile `navigate('Chat', { threadId })`.
  2. Giriş yoksa `navigate('Auth')` veya uyarı.
  3. `listingService.fetchListingById`'e `profiles` join ekleyip satıcı profilini
     döndür (BACKEND.md §6'da da belirtilmiş) — `Product`'a `owner?: UserProfile`
     alanı ekle, mapper'ı güncelle.

---

## 🟠 ORTA — Veri tutarlılığı / UX açıkları

### 4. Logout'ta store'lar temizlenmiyor (veri sızıntısı)
- **Durum:** `authStore.logout()` yalnızca auth state'i sıfırlıyor. `chatStore`
  (`threads`, `messages`) ve `profileStore` (`profile`) logout'ta reset edilmiyor.
  `chatStore.reset()` var ama çağrılmıyor.
- **Sonuç:** A→çıkış→B giriş yaparsa A'nın sohbet/profil verisi B'ye kısa süre
  gözükebilir.
- **Çözüm:** `authStore.logout` içinde (veya `onAuthStateChange` event'inde session
  null ise) `useChatStore.getState().reset()` ve `useProfileStore.getState()`
  temizliği çağır. Ayrıca `favoriteStore.syncFromServer` ile yeniden senkron.

### 5. `authStore.isReady` kullanılmıyor
- **Durum:** `checkAuth` sonunda `set({ isReady: true })` set ediliyor ama
  `RootNavigator` kendi local `isLoading` state'ini yönetiyor, `isReady`'yi
  okumuyor. İki paralel yükleme göstergesi — tutarsız ama çalışır.
- **Çözüm:** `RootNavigator` `isLoading` yerine `useAuthStore((s) => s.isReady)`
  kullansın; tek kaynak.

### 6. Favoriler login anında otomatik sync olmuyor
- **Durum:** `FavoritesScreen` `useEffect`'te `syncFromServer()` çağrıyor ama
  bağımlılık dizisi `isAuthenticated` içermiyor. Ekran açıkken giriş yapılırsa
  tekrar tetiklenmez.
- **Çözüm:** Bağımlılığa `isAuthenticated` ekle, veya `authStore`
  `onAuthStateChange`'te login event'inde `favoriteStore.syncFromServer()` çağır.

### 7. `CreateListingScreen` giriş kontrolü yok
- **Durum:** Service katmanında auth kontrolü var ve hata fırlatır, ama ekran bu
  hatayı submit'e kadar götürmüyor — kullanıcı formu doldurup ancak gönderimde
  hata alıyor.
- **Çözüm:** Ekran mount'ta `isAuthenticated` kontrolü: değilse "Giriş yap"
  yönlendirmesi/yumuşak uyarı göster, formu boşuna doldurtma.

---

## 🟡 DÜŞÜK — Kalite / tutarlılık

### 8. `ListingScreen` hardcoded renk
- `ActivityIndicator size="large" color="#2457ff"` — tema kullanılmıyor. Diğer
  ekranlar `colors.accent`/`colors.primary` kullanıyor. → `color={colors.accent}`.

### 9. `mockData.ts` hala duruyor
- BACKEND.md "hiçbir ekrandan import edilmiyor" diyor — doğrulandı. Referans/seed
  amaçlı tutulabilir veya silinebilir. Zararsız.

### 10. Supabase sorguları `any` döner (tip güvenliği)
- BACKEND.md §5: generated DB tipi yok, `data as Row[]` cast'leri var. İstersen
  `npx supabase gen types typescript` ile typed client'a geçilebilir. Opsiyonel.

### 11. `App.test.tsx` Supabase/@env mockları eksik olabilir
- `__tests__/App.test.tsx` `App`'i render ediyor; `@env`/`@supabase` importları
  test ortamında patlayabilir. `jest.mock('@env')` gerekebilir. `npm test` ile
  doğrulanmalı.

---

## ✅ DOĞRULANANLAR (eksik değil)
- `.env` + `.gitignore` (`.env` hariç, `.env.example` dahil) ✔
- `babel.config.js` `@env` + module-resolver plugin'leri ✔
- `tsconfig.json` path alias'ları babel ile birebir uyumlu ✔
- `supabase/schema.sql` tablolar + RLS + Storage bucket + realtime ✔
- `npx tsc --noEmit` → hatasız ✔
- Katman ayrımı (Screen→Store→Service→Supabase) tutarlı ✔
- Persist + async server-state store ayrımı ✔
- Realtime `subscribeToThread` + optimistik gönderme + dedupe ✔

---

## UYGULAMA SIRASI (önerilen)
1. **AuthScreen + RootNavigator entegrasyonu** (madde 1) — olmadan gerisi anlamsız.
2. **Logout butonu + logout cleanup** (madde 2 + 4) — AuthScreen'le beraber.
3. **ProductDetail → Chat düzeltmesi** (madde 3) — `getOrCreateThread` + satıcı profili.
4. **Favori sync + CreateListing ön kontrol** (madde 6 + 7).
5. **isReady + hardcoded renk + test** (madde 5 + 8 + 11) — cilalama.
