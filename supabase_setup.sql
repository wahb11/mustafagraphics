-- Run this entire file in Supabase SQL Editor.
-- It prepares works + reviews + RLS policies used by this app.

create extension if not exists pgcrypto;

-- =========================
-- Works table
-- =========================
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Logo', 'Social Media', 'Banner', 'Thumbnail', 'Graphic Design', 'Branding')),
  description text not null default '',
  image_url text not null,
  created_at timestamptz not null default now(),
  featured boolean not null default false
);

alter table public.works add column if not exists featured boolean not null default false;

create index if not exists idx_works_created_at on public.works(created_at desc);
create index if not exists idx_works_category_created on public.works(category, created_at desc);

alter table public.works enable row level security;

drop policy if exists "Public read works" on public.works;
create policy "Public read works"
on public.works
for select
to public
using (true);

drop policy if exists "Public manage works" on public.works;
create policy "Public manage works"
on public.works
for all
to public
using (true)
with check (true);

-- =========================
-- Reviews table
-- =========================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  message text not null check (char_length(message) >= 10),
  rating int not null check (rating between 1 and 5),
  status text not null default 'pending' check (status in ('pending', 'approved')),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_status_created on public.reviews(status, created_at desc);
create index if not exists idx_reviews_approved_at on public.reviews(approved_at desc);

alter table public.reviews enable row level security;

drop policy if exists "Public read approved reviews" on public.reviews;
create policy "Public read approved reviews"
on public.reviews
for select
to public
using (status = 'approved');

drop policy if exists "Public submit pending reviews" on public.reviews;
create policy "Public submit pending reviews"
on public.reviews
for insert
to public
with check (status = 'pending');

drop policy if exists "Public moderate reviews" on public.reviews;
create policy "Public moderate reviews"
on public.reviews
for all
to public
using (true)
with check (true);

-- =========================
-- Storage: portfolio-images
-- =========================
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read portfolio images" on storage.objects;
create policy "Public read portfolio images"
on storage.objects
for select
to public
using (bucket_id = 'portfolio-images');

drop policy if exists "Public upload portfolio images" on storage.objects;
create policy "Public upload portfolio images"
on storage.objects
for insert
to public
with check (bucket_id = 'portfolio-images');

drop policy if exists "Public delete portfolio images" on storage.objects;
create policy "Public delete portfolio images"
on storage.objects
for delete
to public
using (bucket_id = 'portfolio-images');

-- =========================
-- Optional seed testimonials (fake/demo)
-- =========================
insert into public.reviews (name, role, message, rating, status, approved_at)
values
  ('Ayesha Khan', 'Startup Founder', 'Mustafa delivered a clean logo and social kit that instantly made our brand look premium.', 5, 'approved', now()),
  ('Bilal Ahmed', 'YouTube Creator', 'My thumbnail CTR improved after the redesign. Great communication and fast revisions.', 5, 'approved', now()),
  ('Hira Malik', 'Marketing Lead', 'Professional banners and social posts that matched our campaign style perfectly.', 4, 'approved', now())
on conflict do nothing;
