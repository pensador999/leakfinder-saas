-- ==============================================================================
-- 🛍️ ADSHIELD SHOPIFY APP STORE INTEGRATION SCHEMA
-- Manages OAuth connections, encrypted access tokens, real-time inventory levels,
-- and Kill-Switch trigger events for Shopify stores.
-- ==============================================================================

-- 1. Table for active Shopify Store Connections via OAuth 2.0
create table if not exists public.shopify_connections (
  id uuid default gen_random_uuid() primary key,
  shop_domain text unique not null,
  access_token text not null,
  scopes text not null default 'read_products,read_inventory,read_orders',
  installed_at timestamp with time zone default timezone('utc'::text, now()),
  uninstalled_at timestamp with time zone,
  status text not null default 'ACTIVE',
  plan_status text not null default 'PRO_TRIAL',
  webhook_registered boolean default false,
  metadata jsonb default '{}'::jsonb
);

-- Index for instant lookup by shop domain
create index if not exists idx_shopify_connections_domain on public.shopify_connections(shop_domain);

-- 2. Table for Physical Warehouse Inventory Levels & Ghost Inventory Auditing
create table if not exists public.shopify_inventory_levels (
  id uuid default gen_random_uuid() primary key,
  shop_domain text references public.shopify_connections(shop_domain) on delete cascade,
  sku text not null,
  product_title text not null,
  variant_title text,
  physical_on_hand integer not null default 0,
  available_for_sale integer not null default 0,
  committed_orders integer not null default 0,
  inventory_policy text not null default 'DENY',
  is_ghost_inventory boolean not null default false,
  last_audited_at timestamp with time zone default timezone('utc'::text, now()),
  unique(shop_domain, sku)
);

create index if not exists idx_shopify_inventory_sku on public.shopify_inventory_levels(shop_domain, sku);
create index if not exists idx_shopify_inventory_ghost on public.shopify_inventory_levels(is_ghost_inventory);

-- 3. Table for Real-time Kill-Switch Trigger Events
create table if not exists public.kill_switch_events (
  id uuid default gen_random_uuid() primary key,
  shop_domain text not null,
  ad_id text not null,
  sku text not null,
  action_taken text not null default 'PAUSED',
  reason text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  whatsapp_alert_dispatched boolean default false
);

create index if not exists idx_kill_switch_shop on public.kill_switch_events(shop_domain, created_at desc);

-- Enable Row Level Security (RLS)
alter table public.shopify_connections enable row level security;
alter table public.shopify_inventory_levels enable row level security;
alter table public.kill_switch_events enable row level security;

-- Policies allowing read/write with service role key
create policy "Allow service role full access on shopify_connections"
  on public.shopify_connections for all
  using (true) with check (true);

create policy "Allow service role full access on shopify_inventory_levels"
  on public.shopify_inventory_levels for all
  using (true) with check (true);

create policy "Allow service role full access on kill_switch_events"
  on public.kill_switch_events for all
  using (true) with check (true);
