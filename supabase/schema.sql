-- ============================================================================
--  TAKASLA — Supabase DB Şema + Row Level Security (RLS)
-- ============================================================================
--  KULLANIM:
--  1. https://supabase.com'da yeni bir proje oluştur.
--  2. Proje Dashboard > SQL Editor > "New query" aç.
--  3. Bu dosyanın TAMAMINI yapıştır ve "Run" de.
--  4. .env dosyasındaki SUPABASE_URL ve SUPABASE_ANON_KEY değerlerini
--     Project Settings > API sekmesinden alıp doldur.
--
--  Bu script idempotent değildir; temiz kurulum için tasarlanmıştır.
-- ============================================================================

-- extensions
create extension if not exists "pgcrypto";

-- ============================================================================
--  TABLOLAR
-- ============================================================================

-- profiles: auth.users ile 1:1, her kullanıcı için otomatik oluşur (trigger)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  email       text not null default '',
  avatar      text,
  rating      numeric not null default 0,
  swap_count  integer not null default 0,
  impact      integer not null default 0,
  joined_at   timestamptz not null default now()
);

-- listings: takasla/sat/bağışla ilanları
create table if not exists public.listings (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  price         text not null default '0',
  currency      text not null default '$',
  image_url     text,
  image_urls    text[] default '{}',
  badge         text,
  tags          text[] default '{}',
  size          text,
  heel_height   text,
  width         text,
  description   text not null default '',
  category      text,
  condition     text,
  price_min     text,
  price_max     text,
  address       text,
  listing_type  text not null default 'sell' check (listing_type in ('sell','swap','donate')),
  rating        numeric default 0,
  distance      text,
  status        text not null default 'active' check (status in ('active','sold','swapped','closed')),
  created_at    timestamptz not null default now()
);

-- favorites: kullanıcı -> ilan (private, kullanıcıya özel)
create table if not exists public.favorites (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- threads: iki kullanıcı arasındaki sohbet (opsiyonel olarak bir ilana bağlı)
create table if not exists public.threads (
  id            uuid primary key default gen_random_uuid(),
  participant_a uuid not null references public.profiles(id) on delete cascade,
  participant_b uuid not null references public.profiles(id) on delete cascade,
  listing_id    uuid references public.listings(id) on delete set null,
  last_message  text,
  updated_at    timestamptz not null default now()
);

-- messages: bir thread içindeki mesajlar
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.threads(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  text        text,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ============================================================================
--  INDEX'LER
-- ============================================================================
create index if not exists idx_listings_owner     on public.listings(owner_id);
create index if not exists idx_listings_type      on public.listings(listing_type);
create index if not exists idx_listings_created   on public.listings(created_at desc);
create index if not exists idx_favorites_user     on public.favorites(user_id);
create index if not exists idx_messages_thread    on public.messages(thread_id, created_at);
create index if not exists idx_threads_participants on public.threads(participant_a);
create index if not exists idx_threads_participants_b on public.threads(participant_b);

-- ============================================================================
--  TRIGGER — yeni auth kullanıcısı için profil otomatik oluştur
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $func$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$func$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
--  ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles  enable row level security;
alter table public.listings  enable row level security;
alter table public.favorites enable row level security;
alter table public.threads   enable row level security;
alter table public.messages  enable row level security;

-- ---- profiles ----
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ---- listings ----
create policy "Listings are viewable by everyone"
  on public.listings for select using (status = 'active' or owner_id = auth.uid());
create policy "Users can create own listings"
  on public.listings for insert with check (owner_id = auth.uid());
create policy "Users can update own listings"
  on public.listings for update using (owner_id = auth.uid());
create policy "Users can delete own listings"
  on public.listings for delete using (owner_id = auth.uid());

-- ---- favorites ----
create policy "Favorites are visible to owner"
  on public.favorites for select using (user_id = auth.uid());
create policy "Users can add own favorites"
  on public.favorites for insert with check (user_id = auth.uid());
create policy "Users can delete own favorites"
  on public.favorites for delete using (user_id = auth.uid());

-- ---- threads ----
create policy "Threads visible to participants"
  on public.threads for select
  using (auth.uid() = participant_a or auth.uid() = participant_b);
create policy "Users can create threads"
  on public.threads for insert
  with check (auth.uid() = participant_a or auth.uid() = participant_b);
create policy "Participants can update threads"
  on public.threads for update
  using (auth.uid() = participant_a or auth.uid() = participant_b);

-- ---- messages ----
create policy "Messages visible to thread participants"
  on public.messages for select using (
    exists (
      select 1 from public.threads t
      where t.id = messages.thread_id
        and (t.participant_a = auth.uid() or t.participant_b = auth.uid())
    )
  );
create policy "Users can send messages in own threads"
  on public.messages for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.threads t
      where t.id = messages.thread_id
        and (t.participant_a = auth.uid() or t.participant_b = auth.uid())
    )
  );

-- ============================================================================
--  STORAGE — ilan fotoğrafları bucket
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Okuma: herkes (public bucket)
create policy "Listing images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Yükleme: sadece auth kullanıcıları
create policy "Authenticated users can upload listing images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-images');

-- Silme/güncelleme: sadece dosya sahibi
create policy "Users can update own listing images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'listing-images' and owner = auth.uid());

create policy "Users can delete own listing images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-images' and owner = auth.uid());

-- ============================================================================
--  REALTIME — mesaj ve thread değişikliklerini dinlemek için
--  (Dashboard > Database > Replication'da public şemasını enable et,
--   veya aşağıdaki komutla ekle.)
-- ============================================================================
alter publication supabase_realtime add table public.messages, public.threads;

-- ============================================================================
--  BITTI
-- ============================================================================
