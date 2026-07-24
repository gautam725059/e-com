-- =====================================================================
--  SHANYA — Supabase setup
--  Run ONCE: Supabase Dashboard → SQL Editor → New query → paste → Run
-- =====================================================================

create extension if not exists pgcrypto;


-- ---------------------------------------------------------------------
-- 1. PRODUCT CATALOG  (admin add / edit / delete)
-- ---------------------------------------------------------------------
create table if not exists public.shanya_catalog (
  id          integer primary key,
  name        text    not null,
  cat         text    not null,
  price       integer not null,
  orig        integer,
  img         text    not null,               -- main image (product cards)
  images      jsonb   not null default '[]'::jsonb,  -- full gallery, first = main
  fallback    text,
  description text,                        -- "desc" is a reserved word → description
  badge       text,
  variants    jsonb   not null default '[]'::jsonb,
  colors      jsonb   not null default '[]'::jsonb,
  rating      numeric not null default 4.8,
  reviews     integer not null default 0,
  updated_at  timestamptz not null default now()
);

create index if not exists shanya_catalog_cat_idx on public.shanya_catalog (cat);

-- If the table already existed, add the multi-image gallery column
-- and backfill it from the existing single image.
alter table public.shanya_catalog add column if not exists images jsonb not null default '[]'::jsonb;
update public.shanya_catalog set images = to_jsonb(array[img])
  where images = '[]'::jsonb and img is not null;

-- Reads/writes happen server-side with the service-role key (bypasses RLS),
-- so no public policy is granted on purpose.
alter table public.shanya_catalog enable row level security;


-- ---------------------------------------------------------------------
-- 2. ORDERS
-- ---------------------------------------------------------------------
create table if not exists public.shanya_orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text unique not null,
  customer_name  text not null,
  phone          text not null,
  email          text,
  address        text not null,
  city           text not null,
  state          text not null,
  pincode        text not null,
  items          jsonb not null,
  subtotal       integer not null,
  shipping       integer not null default 0,
  total          integer not null,
  payment_method text not null default 'cod',      -- cod | razorpay
  payment_status text not null default 'pending',  -- pending | paid
  payment_id     text,                             -- Razorpay payment id
  status         text not null default 'placed',   -- placed|confirmed|shipped|delivered|cancelled
  created_at     timestamptz not null default now()
);

create index if not exists shanya_orders_phone_idx on public.shanya_orders (phone);

-- If the table already existed, make sure the payment columns are there:
alter table public.shanya_orders add column if not exists payment_status text not null default 'pending';
alter table public.shanya_orders add column if not exists payment_id text;

alter table public.shanya_orders enable row level security;


-- ---------------------------------------------------------------------
-- 3. IMAGE STORAGE  (product photos)
-- ---------------------------------------------------------------------
-- Public bucket → anyone can VIEW an image by its URL.
-- Uploads happen server-side with the service-role key.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');


-- =====================================================================
--  Done ✅  Next: add SUPABASE_SERVICE_ROLE_KEY to .env.local (and Vercel)
-- =====================================================================
