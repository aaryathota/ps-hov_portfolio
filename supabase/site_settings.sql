-- Run this once in Supabase SQL Editor if the admin says site_settings is missing.
create table if not exists public.site_settings (
  id bigint primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
drop policy if exists "Authenticated admins manage site settings" on public.site_settings;

create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

create policy "Authenticated admins manage site settings"
  on public.site_settings for all to authenticated
  using (true) with check (true);

insert into public.site_settings (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

notify pgrst, 'reload schema';