-- P.Sonkar House Of Ventures content seed
-- Run after schema.sql in Supabase SQL Editor.
-- Safe to run repeatedly: names are matched before insert/update.

insert into public.ventures (name, description, website_url, image_url, display_order, is_active)
values
  ('Impactshaala', 'A career growth platform where individuals can discover real-world exposures, upskill, and find work that genuinely fits who they are, all in one place.', null, null, 0, true),
  ('Guideshaala', 'An AI-powered career counselling platform that uses assessments to build a personalised career roadmap for students and working professionals.', null, null, 1, true),
  ('Rise For Change', 'A youth-led NGO working on health, quality education, and youth leadership, aligned with the UN Sustainable Development Goals.', null, null, 2, true),
  ('Printer Cartridge Wala', 'A B2B printer consumables and maintenance business offering cartridge refilling, compatible sales, and AMC contracts to corporates and institutions at significantly lower cost.', null, null, 3, true),
  ('LaptopWale.com', 'A B2B business supplying quality-checked, warranty-backed refurbished laptops and desktops to corporates, startups, and institutions at a fraction of new device cost.', null, null, 4, true),
  ('Evntra', 'An event services marketplace to discover and book verified vendors across decoration, catering, entertainment, photography, venues, and equipment, or hand the entire event over to us.', null, null, 5, true),
  ('W.H.O.L.E Community', 'A community for people rebuilding their sense of self after hard setbacks. A structured journey alongside others on the same road. Within. Heal. Own. Lead. Evolve.', null, null, 6, true)
on conflict (lower(trim(name))) do update set
  description = excluded.description,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

insert into public.services (name, description, image_url, display_order, is_active)
values
  ('Brand Identity Studio', 'A specialised design agency crafting purposeful brand identities for early-stage ventures and established corporates alike.', null, 0, true),
  ('Digital Marketing Solutions', 'End-to-end digital marketing and brand strategy for growing businesses.', null, 1, true),
  ('Legal & Compliance', 'Company registration, legal compliance, and tax consultation for startups.', null, 2, true),
  ('Events & Experiences', 'From leadership offsites to large company gatherings, we plan and run events that go beyond logistics. The focus is on building real energy, connection, and culture within your organisation. You show up. We handle everything else.', null, 3, true),
  ('US Immigration Visa Services', 'US visa and immigration paperwork is dense and easy to get wrong. We work with individuals, families, and employers through the process from start to finish, making sure the documentation is right and nothing important gets missed.', null, 4, true),
  ('Real Estate & BBMP Services', 'Whether it is a property transaction, a BBMP approval, or documentation that keeps getting stuck, we take it off your plate. We work with both individuals and businesses, and we know how to get things moving without the usual back-and-forth.', null, 5, true),
  ('Turnkey Projects', 'From office setups to infrastructure builds and operational rollouts, we take full responsibility from planning to final handover. One point of contact, clear accountability, and no passing the buck between vendors.', null, 6, true),
  ('SaaS Product Development', 'We work with founders and businesses to build SaaS products that are thought through properly before a single line of code is written. The result is a product that works, can scale, and has a real path to market.', null, 7, true),
  ('AI-Led Business Tools', 'We build AI-powered tools for businesses that want to stop doing things manually or make better decisions faster. No buzzwords, no overcomplicated systems. Just tools that fit how your business actually works.', null, 8, true),
  ('360 Marketing Services', 'Search. Social. Street. Screen. We build and run marketing strategies that cover all the right touchpoints for your brand. The goal is not just visibility. It is the kind of presence that makes your brand the obvious choice.', null, 9, true),
  ('Apparel Manufacturing', 'We connect brands and businesses with manufacturing partners who can deliver on quality and volume. Whether you are placing your first order or scaling an existing line, we make sure production runs the way it should.', null, 10, true),
  ('Corporate Travel Logistics', 'Flights, hotels, ground transfers, last-mile pickups. We manage corporate travel from start to finish so your team can focus on the work, not the logistics. Cost-conscious by default, reliable every time.', null, 11, true),
  ('Pre-Owned MacBooks', 'Every MacBook we sell is checked, tested, and ready to use from day one. For startups, SMEs, and growing teams, it is a straightforward way to get solid hardware without paying for a brand-new price tag.', null, 12, true),
  ('Corporate Cartridge Refilling', 'We refill cartridges for corporate offices at a fraction of what you pay for new ones. Scheduled pickups, quick turnarounds, and a service that works around your office, not the other way around.', null, 13, true)
on conflict (lower(trim(name))) do update set
  description = excluded.description,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

insert into public.contact_settings (id, primary_email, primary_whatsapp, linkedin_url, instagram_url, twitter_url, location)
values (1, 'hello@psonkarventures.com', '+919876543210', 'https://linkedin.com/in/pratapsonkar', 'https://instagram.com/psonkarventures', 'https://twitter.com/pratapsonkar', 'Bangalore, Karnataka, India')
on conflict (id) do update set
  primary_email = excluded.primary_email,
  primary_whatsapp = excluded.primary_whatsapp,
  linkedin_url = excluded.linkedin_url,
  instagram_url = excluded.instagram_url,
  twitter_url = excluded.twitter_url,
  location = excluded.location;

-- The full hero/page-copy JSON is generated by the admin's first Publish action.
-- This row makes the public read path valid before that first publish.
insert into public.site_settings (id, content)
values (1, '{"hero":{"tagline":"A network of ventures built for people and businesses to grow.","title":"P.Sonkar","titleLine":"House Of","titleAccent":"Ventures.","sideTitle":"A founder-led ecosystem.","sideText":"Built around the ventures I build, the people I work with, and the opportunities I create. Based in Bangalore.","portraitUrl":"/images/founder.webp"},"services":[]}'::jsonb)
on conflict (id) do nothing;
