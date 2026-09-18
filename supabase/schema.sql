-- Existing tables expected:
-- ventures: id, name, description, image_url, website_url, display_order, is_active
-- services: id, name, description, image_url, display_order, is_active
-- contact_settings: one row containing the public admin contact details

create table if not exists public.contact_settings (
  id bigint primary key default 1 check (id = 1),
  primary_email text,
  primary_whatsapp text,
  linkedin_url text,
  instagram_url text,
  twitter_url text,
  location text,
  updated_at timestamptz default now()
);

alter table public.contact_settings enable row level security;

drop policy if exists "Public can read contact settings" on public.contact_settings;
drop policy if exists "Authenticated admins manage contact settings" on public.contact_settings;

create policy "Public can read contact settings"
  on public.contact_settings for select
  using (true);

create policy "Authenticated admins manage contact settings"
  on public.contact_settings for all to authenticated
  using (true) with check (true);

insert into public.contact_settings (id, primary_email, primary_whatsapp, linkedin_url, instagram_url, twitter_url, location)
values (1, 'hello@psonkarventures.com', '+919876543210', 'https://linkedin.com/in/pratapsonkar', 'https://instagram.com/psonkarventures', 'https://twitter.com/pratapsonkar', 'Bangalore, Karnataka, India')
on conflict (id) do nothing;

alter table public.ventures enable row level security;
alter table public.services enable row level security;

drop policy if exists "Public can read live ventures" on public.ventures;
drop policy if exists "Public can read live services" on public.services;
drop policy if exists "Public can read active ventures" on public.ventures;
drop policy if exists "Public can read active services" on public.services;
drop policy if exists "Authenticated admins manage ventures" on public.ventures;
drop policy if exists "Authenticated admins manage services" on public.services;
drop policy if exists "Authenticated users manage ventures" on public.ventures;
drop policy if exists "Authenticated users manage services" on public.services;

create policy "Public can read active ventures"
  on public.ventures for select
  using (is_active = true);

create policy "Public can read active services"
  on public.services for select
  using (is_active = true);

create policy "Authenticated admins manage ventures"
  on public.ventures for all to authenticated
  using (true) with check (true);

create policy "Authenticated admins manage services"
  on public.services for all to authenticated
  using (true) with check (true);

-- Keep one database record per portfolio name, including duplicates already present.
with ranked_ventures as (
  select id, row_number() over (partition by lower(trim(name)) order by id) as row_number
  from public.ventures
)
delete from public.ventures
where id in (select id from ranked_ventures where row_number > 1);

with ranked_services as (
  select id, row_number() over (partition by lower(trim(name)) order by id) as row_number
  from public.services
)
delete from public.services
where id in (select id from ranked_services where row_number > 1);

create unique index if not exists ventures_name_unique on public.ventures (lower(trim(name)));
create unique index if not exists services_name_unique on public.services (lower(trim(name)));

-- Add every existing frontend item once. Images can be added later in /admin.
insert into public.ventures (name, description, image_url, website_url, display_order, is_active)
select seed.name, seed.description, null, null, seed.display_order, true
from (values
  ('Impactshaala', 'A career growth platform where individuals can discover real-world exposures, upskill, and find work that genuinely fits who they are, all in one place.', 0),
  ('Guideshaala', 'An AI-powered career counselling platform that uses assessments to build a personalised career roadmap for students and working professionals.', 1),
  ('Rise For Change', 'A youth-led NGO working on health, quality education, and youth leadership, aligned with the UN Sustainable Development Goals.', 2),
  ('Printer Cartridge Wala', 'A B2B printer consumables and maintenance business offering cartridge refilling, compatible sales, and AMC contracts to corporates and institutions at significantly lower cost.', 3),
  ('LaptopWale.com', 'A B2B business supplying quality-checked, warranty-backed refurbished laptops and desktops to corporates, startups, and institutions at a fraction of new device cost.', 4),
  ('Evntra', 'An event services marketplace to discover and book verified vendors across decoration, catering, entertainment, photography, venues, and equipment, or hand the entire event over to us.', 5),
  ('W.H.O.L.E Community', 'A community for people rebuilding their sense of self after hard setbacks. A structured journey alongside others on the same road. Within. Heal. Own. Lead. Evolve.', 6)
) as seed(name, description, display_order)
where not exists (select 1 from public.ventures existing where existing.name = seed.name);

insert into public.services (name, description, image_url, display_order, is_active)
select seed.name, seed.description, null, seed.display_order, true
from (values
  ('Brand Identity Studio', 'A specialised design agency crafting purposeful brand identities for early-stage ventures and established corporates alike.', 0),
  ('Digital Marketing Solutions', 'End-to-end digital marketing and brand strategy for growing businesses.', 1),
  ('Legal & Compliance', 'Company registration, legal compliance, and tax consultation for startups.', 2)
) as seed(name, description, display_order)
where not exists (select 1 from public.services existing where existing.name = seed.name);

-- Storage bucket configured by the app: website-images.
insert into storage.buckets (id, name, public)
values ('website-images', 'website-images', true)
on conflict (id) do nothing;

update storage.buckets
set public = true
where id = 'website-images';

-- Do not delete storage.objects with SQL. Supabase requires old bucket files
-- to be removed through Storage API or the Storage dashboard first.

drop policy if exists "Public can view site assets" on storage.objects;
drop policy if exists "Authenticated admins upload site assets" on storage.objects;
drop policy if exists "Authenticated admins update site assets" on storage.objects;
drop policy if exists "Authenticated admins delete site assets" on storage.objects;

create policy "Public can view site assets"
  on storage.objects for select
  using (bucket_id = 'website-images');

create policy "Authenticated admins upload site assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'website-images');

create policy "Authenticated admins update site assets"
  on storage.objects for update to authenticated
  using (bucket_id = 'website-images')
  with check (bucket_id = 'website-images');

create policy "Authenticated admins delete site assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'website-images');
