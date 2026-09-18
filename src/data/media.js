/*
  Background image per venture and per partner service.

  `src` points at a free stock photo (Unsplash or Pexels, both free for
  commercial use). `fallback` is a locally generated plate in the venture's
  accent colour, used automatically if the remote photo fails to load.

  For production: download each photo, drop it in /public/images/ventures/
  and point `src` at the local file. Hotlinking works but a self-hosted copy
  is faster and cannot disappear.
*/

const UNSPLASH = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?fm=jpg&q=70&w=${w}&auto=format&fit=crop`;
const PEXELS = (path, w = 1600) =>
  `https://images.pexels.com/photos/${path}?auto=compress&cs=tinysrgb&w=${w}`;

export const ventureMedia = {
  impactshaala: {
    accent: '#5b8def',
    tint: 'rgba(24, 40, 78, 0.55)',
    src: PEXELS('3184663/pexels-photo-3184663.jpeg'),
    fallback: '/images/plates/impactshaala.jpg',
    alt: 'Young professionals working together around a table in a bright room',
  },
  guideshaala: {
    accent: '#9b8cf0',
    tint: 'rgba(38, 30, 74, 0.55)',
    src: UNSPLASH('1573497620053-ea5300f94f21'),
    fallback: '/images/plates/guideshaala.jpg',
    alt: 'Two people in conversation across a table',
  },
  'rise-for-change': {
    accent: '#63c39b',
    tint: 'rgba(18, 48, 40, 0.52)',
    src: UNSPLASH('1441974231531-c6227db76b6e'),
    fallback: '/images/plates/rise-for-change.jpg',
    alt: 'Sunlight breaking through a stand of trees',
  },
  'printer-cartridge-wala': {
    accent: '#e0a05c',
    tint: 'rgba(58, 34, 16, 0.55)',
    src: PEXELS('17536002/pexels-photo-17536002.jpeg'),
    fallback: '/images/plates/printer-cartridge-wala.jpg',
    alt: 'Ink cartridges inside an open inkjet printer',
  },
  laptopwale: {
    accent: '#6fb6d8',
    tint: 'rgba(16, 36, 52, 0.55)',
    src: PEXELS('2136243/pexels-photo-2136243.jpeg'),
    fallback: '/images/plates/laptopwalecom.jpg',
    alt: 'A technician testing a laptop at a workbench',
  },
  evntra: {
    accent: '#e883a6',
    tint: 'rgba(52, 18, 34, 0.52)',
    src: UNSPLASH('1465101162946-4377e57745c3'),
    fallback: '/images/plates/evntra.jpg',
    alt: 'Long exposure of lights across a dark evening scene',
  },
  'whole-community': {
    accent: '#d8c07f',
    tint: 'rgba(44, 38, 22, 0.52)',
    src: UNSPLASH('1470071459604-3b5ec3a7fe05'),
    fallback: '/images/plates/whole-community.jpg',
    alt: 'Mist moving through a quiet valley at first light',
  },
};

/* Photographs used by pages and section bands, one per surface so nothing
   repeats across the site. */
export const pageMedia = {
  statement: {
    src: PEXELS('3184354/pexels-photo-3184354.jpeg', 1900),
    fallback: '/images/plates/impactshaala.jpg',
    alt: 'A team working together, seen from above',
  },
  about: {
    src: PEXELS('240223/pexels-photo-240223.jpeg', 1900),
    fallback: '/images/plates/guideshaala.jpg',
    alt: 'People working in a city cafe',
  },
};

export const serviceMedia = {
  'brand-identity': { src: '/images/plates/service-brand.jpg', accent: '#9fb0ee' },
  'digital-marketing': { src: '/images/plates/service-digital.jpg', accent: '#e0a05c' },
  'legal-compliance': { src: '/images/plates/service-legal.jpg', accent: '#7fc4b4' },
};

/* Matches a venture or service name to its media entry. */
export const slugify = (name = '') =>
  name.toLowerCase().replace(/\.com/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function mediaFor(name, map = ventureMedia) {
  const slug = slugify(name);
  return map[slug] || Object.entries(map).find(([key]) => slug.startsWith(key) || key.startsWith(slug))?.[1] || null;
}
