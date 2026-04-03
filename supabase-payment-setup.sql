-- ListingAI Ödeme Sistemi - Supabase Tabloları
-- Bu SQL'i Supabase Dashboard > SQL Editor'a yapıştırıp çalıştır

-- 1. Kullanıcı profilleri tablosu (plan bilgisi)
create table if not exists user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  plan text default 'free' check (plan in ('free', 'pro', 'business')),
  listings_used integer default 0,
  listings_limit integer default 10,
  plan_started_at timestamp with time zone,
  plan_expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- 2. Ödeme talepleri tablosu
create table if not exists payment_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  plan text not null check (plan in ('pro', 'business')),
  amount numeric not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  sender_name text,
  transfer_note text,
  admin_note text,
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

-- 3. RLS Güvenlik
alter table user_profiles enable row level security;
alter table payment_requests enable row level security;

-- Kullanıcılar kendi profillerini görebilir
create policy "Users can view own profile"
  on user_profiles for select
  using (auth.uid() = id);

-- Kullanıcılar kendi profillerini güncelleyebilir
create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- Profil otomatik oluşsun
create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

-- Service role tam erişim
create policy "Service role full access profiles"
  on user_profiles for all
  using (true)
  with check (true);

-- Kullanıcılar kendi ödeme taleplerini görebilir
create policy "Users can view own payments"
  on payment_requests for select
  using (auth.uid() = user_id);

-- Kullanıcılar ödeme talebi oluşturabilir
create policy "Users can insert payments"
  on payment_requests for insert
  with check (auth.uid() = user_id);

-- Service role tam erişim
create policy "Service role full access payments"
  on payment_requests for all
  using (true)
  with check (true);

-- 4. Index'ler
create index if not exists idx_user_profiles_plan on user_profiles(plan);
create index if not exists idx_payment_requests_user on payment_requests(user_id);
create index if not exists idx_payment_requests_status on payment_requests(status);

-- 5. Otomatik profil oluşturma fonksiyonu (yeni kayıt olunca)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: Yeni kullanıcı kayıt olunca otomatik profil oluştur
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
