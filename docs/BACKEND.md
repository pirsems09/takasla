# Takasla — Backend (Supabase) + Zustand Kullanım Rehberi

Free backend olarak **Supabase** seçildi. Bu doküman mimariyi, kurulumu ve
Zustand store'larının sayfalarda nasıl kullanıldığını açıklar.

---

## 1. Mimari (Katmanlar)

```
 Ekran (Screen)
   │  useListingStore((s) => s.listings)   ← selector (mevcut pattern korundu)
   ▼
 Store (Zustand)        src/store/*
   │  fetchListings() / loading / error     ← async server-state pattern
   ▼
 Service                src/api/*Service.ts
   │  supabase.from('listings').select(...)  ← sadece DB erişimi + mapper
   ▼
 Supabase Client        src/lib/supabase.ts
   │  createClient(url, anonKey, { auth: AsyncStorage })
   ▼
 Supabase (Cloud)       PostgreSQL + Auth + Storage + Realtime
```

**Kural:** Ekranlar hiçbir zaman `supabase`'i doğrudan çağırmaz — sadece store
selector'larını kullanır. Service, DB satırını (snake_case) domain tipine
(camelCase `Product`/`Thread`/`Message`) map'ler → ekranlar DB yapısını bilmez.

### State ayrımı

| Tür            | Nerede              | Persist? | Store |
|----------------|---------------------|----------|-------|
| Saf client     | Zustand + persist   | ✅ | themeStore, introStore |
| Auth session   | Zustand (Supabase)  | ✅* | authStore |
| Server state   | Zustand (async)     | ❌ | listingStore, chatStore, profileStore |
| Hibrit offline | persist + sync      | ✅ | favoriteStore |

\* Supabase session'ı kendi AsyncStorage adapter'ıyla persist edilir.

---

## 2. Supabase Kurulumu (5 dakika)

1. https://supabase.com'da ücretsiz proje oluştur.
2. Dashboard → **SQL Editor** → `supabase/schema.sql` dosyasının **tamamını**
   yapıştır → **Run** (tablolar + RLS + Storage bucket + realtime + profil trigger).
3. **Settings → API**'den `Project URL` ve `anon public` key'i al.
4. Kök dizindeki `.env` dosyasını doldur:
   ```
   SUPABASE_URL=https://XXXXX.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOi....anon_key...
   ```
5. Metro'yu yeniden başlat: `npm start -- --reset-cache`.

> `.env` `.gitignore`'dadır (commit edilmez). Şablon: `.env.example`.
> Veri eklemek için giriş yap → **İlan Ekle** tab → yayınla (Storage upload + insert).

---

## 3. Zustand Kullanım Pattern'i (Sayfa Bazında)

Tüm ekranlar **aynı selector alışkanlığını** korur — sadece veri kaynağı
mock → store oldu:

```tsx
const listings = useListingStore((s) => s.listings);
const loading  = useListingStore((s) => s.loading);
const fetchListings = useListingStore((s) => s.fetchListings);

useEffect(() => { fetchListings(); }, [fetchListings]);

if (loading && listings.length === 0) return <ActivityIndicator />;
if (listings.length === 0) return <EmptyState />;
return <Feed items={listings} />;
```

| Ekran | Store | Akış |
|-------|-------|------|
| ListingScreen | useListingStore | `fetchListings()` mount'ta |
| AllListingsScreen | useListingStore | store listings + client sort |
| ProductDetailScreen | useListingStore | `fetchListingById(id)` + `detail[id]` cache |
| FavoritesScreen | useFavoriteStore + useListingStore | `syncFromServer()` + listings |
| ProfileScreen | useProfileStore + useListingStore | `fetchProfile()` + `fetchListingsByOwner(userId)` |
| ChatHistoryScreen | useChatStore | `fetchThreads()` (giriş gerekli) |
| ChatScreen | useChatStore | `fetchMessages()` + `subscribeToThread()` (realtime) + `sendMessage()` (optimistik) |
| CreateListingScreen | useListingStore | `uploadImage(uri)` → `createListing(payload)` |
| RootNavigator | useAuthStore | `checkAuth()` (session restore) |

---

## 4. Store Cheat-Sheet

```ts
// authStore
useAuthStore.getState().signIn(email, password)
useAuthStore.getState().signUp(email, password, name)
useAuthStore.getState().logout()
useAuthStore((s) => s.isAuthenticated)   // / userId / email

// listingStore
useListingStore.getState().fetchListings({ listingType: 'swap' })
useListingStore.getState().fetchListingById(id)
useListingStore.getState().createListing(payload)   // CreateListingPayload
useListingStore.getState().uploadImage(uri)          // -> publicUrl

// favoriteStore (hibrit)
useFavoriteStore.getState().toggleFavorite(id)       // optimistik + server sync
useFavoriteStore.getState().syncFromServer()         // login sonrası
useFavoriteStore((s) => s.favoriteIds)

// chatStore (realtime)
useChatStore.getState().fetchThreads()
useChatStore.getState().fetchMessages(threadId)
useChatStore.getState().sendMessage(threadId, text)  // optimistik
const unsub = useChatStore.getState().subscribeToThread(threadId) // canlı
// ...unsub() // cleanup (useEffect return)

// profileStore
useProfileStore.getState().fetchProfile()
useProfileStore.getState().updateProfile({ name, avatar })
```

---

## 5. Yeni Bir Backend Özelliği Ekleme

1. `supabase/schema.sql`'e tablo + RLS politikası ekle, Dashboard'da çalıştır.
2. `src/api/types.ts`'e row tipi + mapper ekle.
3. `src/api/xService.ts`'e fonksiyon yaz (`supabase.from(...)`).
4. `src/store/xStore.ts`'te async action ekle (`loading`/`error`/`data`).
5. Ekranda `useXStore((s) => s.data)` ile seç, `useEffect` ile fetch et.

### Daha sıkı tip güvenliği (opsiyonel)
Şu an Supabase sorguları `any` döner (generated DB tipi yok). İstersen:
```sh
npx supabase gen types typescript --project-id <ref> > src/api/database.types.ts
```
sonra `src/lib/supabase.ts`'te `createClient<Database>(...)` ile typed client kullan.
Tüm `data as Row[]` cast'leri otomatik tipe dönüşür.

---

## 6. Notlar

- `axios` artık kullanılmıyor (axiosInstance kaldırıldı); Supabase kendi HTTP
  katmanını kullanır. `react-native-url-polyfill` Supabase için gerekli (URL API).
- `mockData.ts` artık hiçbir ekrandan import edilmiyor; referans/seed amaçlı durur.
- İlan sahibi (seller) bilgisi ProductDetail'de owner profile fetch'i yapmıyor —
  `listingService.fetchListingById`'e profil join eklenerek geliştirilebilir.
- Realtime için `supabase_realtime` publication'ına `messages`/`threads` eklendi
  (schema.sql). Chat ekranı `subscribeToThread` ile canlı mesaj alır.

