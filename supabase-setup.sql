-- ListingAI Supabase Veritabanı Kurulumu
-- Bu SQL'i Supabase Dashboard > SQL Editor'a yapıştırıp çalıştır

-- 1. Listings tablosu
create table if not exists listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_name text not null,
  brand text,
  category text,
  features text not null,
  keywords text,
  platforms text[] not null,
  created_at timestamp with time zone default now()
);

-- 2. Listing sonuçları tablosu
create table if not exists listing_results (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings(id) on delete cascade not null,
  platform text not null,
  title text not null,
  bullets text[] not null,
  description text not null,
  seo_score integer,
  seo_tips jsonb,
  created_at timestamp with time zone default now()
);

-- 3. Row Level Security (RLS) - Güvenlik
alter table listings enable row level security;
alter table listing_results enable row level security;

-- Kullanıcılar sadece kendi listinglerini görebilir
create policy "Users can view own listings"
  on listings for select
  using (auth.uid() = user_id);

-- Kullanıcılar kendi listinglerini oluşturabilir
create policy "Users can insert own listings"
  on listings for insert
  with check (auth.uid() = user_id);

-- Service role her şeyi yapabilir (API route'lar için)
create policy "Service role full access to listings"
  on listings for all
  using (true)
  with check (true);

-- Listing sonuçları için politikalar
create policy "Users can view own listing results"
  on listing_results for select
  using (
    listing_id in (
      select id from listings where user_id = auth.uid()
    )
  );

create policy "Service role full access to listing_results"
  on listing_results for all
  using (true)
  with check (true);

-- 4. Index'ler (hız için)
create index if not exists idx_listings_user_id on listings(user_id);
create index if not exists idx_listings_created_at on listings(created_at desc);
create index if not exists idx_listing_results_listing_id on listing_results(listing_id);
