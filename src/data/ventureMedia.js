/*
  Picture and tone for each venture.

  Image priority on the site:
    1. the image uploaded for that venture in the admin panel (image_url)
    2. the picture listed below
    3. one of the three shared previews, chosen by position

  kind
    'screenshot'  a picture of the venture's own website. Gets a deeper navy
                  wash on the Ventures page, since a screen is busier than a photo.
    'photo'       a photograph that sets the scene, credited on the page.

  The six photos are free-licence Unsplash images (https://unsplash.com/license),
  loaded from Unsplash's image CDN, which Unsplash permits and which serves a
  right-sized, compressed file to every screen. To host them yourself instead,
  run `npm run fetch-images`: it saves them to /public/images/ventures/ and
  prints the lines to paste in here.

  position is the CSS object-position used when a picture is cropped.
*/

const key = (name = '') => name.toLowerCase().replace(/[^a-z0-9]+/g, '');

/** Stable anchor for a venture, e.g. "printer-cartridge-wala". Used by /ventures#... links. */
export const ventureSlug = (name = '') => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Unsplash CDN address for a photo at a given width. */
export const unsplash = (id, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=78`;

const SHARED = [
  { src: '/images/ventures/mockup-1.webp', position: '50% 46%', kind: 'photo' },
  { src: '/images/ventures/mockup-2.webp', position: '50% 50%', kind: 'photo' },
  { src: '/images/ventures/mockup-3.webp', position: '50% 44%', kind: 'photo' },
];

const LOCAL = {
  impactshaala: {
    kind: 'screenshot',
    src: '/images/ventures/impactshaala.webp',
    position: '70% 0%',
    alt: 'The Impactshaala Discover page, listing opportunities for seekers',
  },
  guideshaala: {
    kind: 'photo',
    photo: 'photo-1522881193457-37ae97c905bf',
    position: '50% 45%',
    alt: 'A mentor talking a student through a plan on a laptop',
    credit: 'Quilia',
    creditUrl: 'https://unsplash.com/photos/y_6rqStQBYQ',
  },
  riseforchange: {
    kind: 'photo',
    photo: 'photo-1524069290683-0457abfe42c3',
    position: '50% 38%',
    alt: 'A group of smiling schoolchildren in uniform',
    credit: 'Church of the King',
    creditUrl: 'https://unsplash.com/photos/j9jZSqfH5YI',
  },
  printercartridgewala: {
    kind: 'photo',
    photo: 'photo-1703950104186-aeb81511cfd2',
    position: '50% 55%',
    alt: 'Cyan, magenta, yellow and black ink bottles in a row',
    credit: 'A J.',
    creditUrl: 'https://unsplash.com/photos/eVhc4EojmlY',
  },
  laptopwalecom: {
    kind: 'photo',
    photo: 'photo-1606625000171-fa7d471da28c',
    position: '50% 50%',
    alt: 'An open laptop resting on a stack of closed laptops',
    credit: 'JC Daily',
    creditUrl: 'https://unsplash.com/photos/-bh5joV8-GI',
  },
  evntra: {
    kind: 'photo',
    photo: 'photo-1587271407850-8d438ca9fdf2',
    position: '50% 55%',
    alt: 'A ballroom set for a celebration, with a floral stage under a chandelier',
    credit: 'Amish Thakkar',
    creditUrl: 'https://unsplash.com/photos/BEdxXAiRfRM',
  },
  wholecommunity: {
    kind: 'photo',
    photo: 'photo-1661608973011-48eb18cb8330',
    position: '50% 60%',
    alt: 'A person on a hillside above a valley in early morning light',
    credit: 'Tab Chang',
    creditUrl: 'https://unsplash.com/photos/fB95GaefEfk',
  },
};

// Accent tones come from the site palette: navy, teal, gold
const TONES = ['#2d5a8e', '#0d7377', '#b8860b'];

/**
 * Everything the pages need to show one venture's picture.
 * `src` is sized for large frames, `thumb` for list rows and hover previews.
 */
export function ventureMedia(venture, index = 0) {
  const id = key(venture?.name);
  const local = LOCAL[id] || SHARED[index % SHARED.length];
  const src = local.photo ? unsplash(local.photo, 1600) : local.src;
  const thumb = local.photo ? unsplash(local.photo, 640) : local.src;
  const backdrop = local.photo ? unsplash(local.photo, 480) : local.src;
  return {
    src,
    thumb,
    backdrop,
    srcSet: local.photo ? [900, 1400, 2000, 2800].map((w) => `${unsplash(local.photo, w)} ${w}w`).join(', ') : undefined,
    position: local.position,
    kind: local.kind || 'photo',
    host: local.host || '',
    alt: local.alt || '',
    credit: local.credit || '',
    creditUrl: local.creditUrl || '',
    isUpload: false,
    sector: venture?.sector || '',
    tone: TONES[index % TONES.length],
  };
}

/** Photo ids, used by scripts/fetch-venture-images.mjs */
export const VENTURE_PHOTOS = Object.fromEntries(
  Object.entries(LOCAL).filter(([, v]) => v.photo).map(([k, v]) => [k, v.photo]),
);

/** Host name shown in the browser frame, e.g. "impactshaala.com" */
export function hostOf(url) {
  if (!url) return '';
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return ''; }
}
