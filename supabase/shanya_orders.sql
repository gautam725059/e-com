-- ============================================================
--  Shanya — orders table. Run this once in the Supabase SQL editor
--  (Dashboard → SQL Editor → New query → paste → Run).
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.shanya_orders (
  id            uuid primary key default gen_random_uuid(),
  order_number  text unique not null,
  customer_name text not null,
  phone         text not null,
  email         text,
  address       text not null,
  city          text not null,
  state         text not null,
  pincode       text not null,
  items         jsonb not null,          -- [{id,name,price,qty,variant,color}]
  subtotal      integer not null,
  shipping      integer not null default 0,
  total         integer not null,
  payment_method text not null default 'cod',
  status        text not null default 'placed',  -- placed|confirmed|shipped|delivered|cancelled
  created_at    timestamptz not null default now()
);

create index if not exists shanya_orders_phone_idx on public.shanya_orders (phone);

-- Row Level Security: the storefront (anon key) may CREATE orders, but reading
-- orders is done server-side with the service-role key only (keeps customer
-- data private). No public SELECT policy on purpose.
alter table public.shanya_orders enable row level security;

drop policy if exists "anon can insert orders" on public.shanya_orders;
create policy "anon can insert orders"
  on public.shanya_orders
  for insert
  to anon
  with check (true);
