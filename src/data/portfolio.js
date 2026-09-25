/*
  Local copy of the portfolio, taken from supabase/schema.sql seed data.
  Used only when Supabase is not configured (local dev, previews), so the
  site never renders empty. Live content still comes from the admin panel.

  `sector` is a short plain-language label written from each description.
  It is not stored in Supabase yet. Add a `sector` column if you want to
  edit it from the admin panel; the homepage already reads it when present.
*/

export const fallbackVentures = [
  { id: 'impactshaala', name: 'Impactshaala', sector: 'Careers', display_order: 0, is_active: true, image_url: null, website_url: null,
    description: 'A career growth platform where individuals can discover real-world exposures, upskill, and find work that genuinely fits who they are, all in one place.' },
  { id: 'guideshaala', name: 'Guideshaala', sector: 'Career guidance', display_order: 1, is_active: true, image_url: null, website_url: null,
    description: 'An AI-powered career counselling platform that uses assessments to build a personalised career roadmap for students and working professionals.' },
  { id: 'rise-for-change', name: 'Rise For Change', sector: 'Non-profit', display_order: 2, is_active: true, image_url: null, website_url: null,
    description: 'A youth-led NGO working on health, quality education, and youth leadership, aligned with the UN Sustainable Development Goals.' },
  { id: 'printer-cartridge-wala', name: 'Printer Cartridge Wala', sector: 'B2B supplies', display_order: 3, is_active: true, image_url: null, website_url: null,
    description: 'A B2B printer consumables and maintenance business offering cartridge refilling, compatible sales, and AMC contracts to corporates and institutions at significantly lower cost.' },
  { id: 'laptopwale', name: 'LaptopWale.com', sector: 'B2B hardware', display_order: 4, is_active: true, image_url: null, website_url: null,
    description: 'A B2B business supplying quality-checked, warranty-backed refurbished laptops and desktops to corporates, startups, and institutions at a fraction of new device cost.' },
  { id: 'evntra', name: 'Evntra', sector: 'Events', display_order: 5, is_active: true, image_url: null, website_url: null,
    description: 'An event services marketplace to discover and book verified vendors across decoration, catering, entertainment, photography, venues, and equipment, or hand the entire event over to us.' },
  { id: 'whole-community', name: 'W.H.O.L.E Community', sector: 'Community', display_order: 6, is_active: true, image_url: null, website_url: null,
    description: 'A community for people rebuilding their sense of self after hard setbacks. A structured journey alongside others on the same road. Within. Heal. Own. Lead. Evolve.' },
];

export const fallbackServices = [
  { id: 'brand-identity', name: 'Brand Identity Studio', display_order: 0, is_active: true, image_url: null,
    description: 'A specialised design agency crafting purposeful brand identities for early-stage ventures and established corporates alike.' },
  { id: 'digital-marketing', name: 'Digital Marketing Solutions', display_order: 1, is_active: true, image_url: null,
    description: 'End-to-end digital marketing and brand strategy for growing businesses.' },
  { id: 'legal-compliance', name: 'Legal & Compliance', display_order: 2, is_active: true, image_url: null,
    description: 'Company registration, legal compliance, and tax consultation for startups.' },
];
