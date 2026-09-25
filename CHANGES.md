# Round 2 (September 2026)

- **New tagline** everywhere (hero, footer, page metadata): "A network of
  ventures built for people and businesses to grow."
- **Ventures page, full screen.** Each venture's picture now fills the whole
  screen, edge to edge, with its number, sector, name, description and links
  set over it on a navy gradient. The picture drifts a little slower than the
  page and settles from a slight zoom. A thin gold frame sits just inside the
  edges, and the progress rail turns light over the pictures. On phones the
  text sits at the bottom of each full-height picture.
- **Impactshaala** is a website screenshot, and stretched full screen it went
  blurry and grey. Its chapter is navy instead, with the screenshot as a large,
  slightly tilted browser window running off the right edge, so it stays sharp.
- **Home: the venture list and its hover pop-ups are gone.** In their place is
  "How it works": three steps (tell me what you are after, we talk it through,
  we build it together) on a gold line that draws itself as you scroll, with
  Roman numerals in gold rings, and a "Start the conversation" button.
- Fixed: two home animations could end up stuck part-way (the step numerals
  at 40% size) when the page re-ran them after loading data, and the "ways"
  cards' hover lift never worked because the entrance animation overrode it.

# What changed in this pass (September 2026)

Same site, same light navy/gold theme and layout. This pass adds real pictures,
a classic serif voice and a few quiet animations.

## Pictures
- **Impactshaala** now shows the real Discover page screenshot
  (`public/images/ventures/impactshaala.webp`), whole and uncropped, in the
  browser frame.
- The other six ventures each have a photo chosen for what they do. All are
  free-licence Unsplash photos, credited on the Ventures page:
  - Guideshaala: a mentor talking a student through a plan on a laptop (Quilia)
  - Rise For Change: smiling schoolchildren in uniform (Church of the King)
  - Printer Cartridge Wala: cyan, magenta, yellow and black ink bottles (A J.)
  - LaptopWale.com: an open laptop on a stack of laptops (JC Daily)
  - Evntra: a ballroom set for a celebration under a chandelier (Amish Thakkar)
  - W.H.O.L.E Community: a person on a hillside at first light (Tab Chang)
- Photos load from Unsplash's image CDN at the right size for each screen. To
  host them yourself, run `npm run fetch-images` (see
  `scripts/fetch-venture-images.mjs`).
- Photos are shown as a **mounted print** (white mat, gold hairline, credit
  line). Screenshots keep the browser frame.
- Home venture list: each row now has a small photo that comes into full
  colour on hover, and a serif numeral.

## Traditional and modern
- Added **Fraunces** (self-hosted), a classic serif close to the P.Sonkar
  wordmark. It is used only for accents: one phrase per heading
  ("House Of *Ventures.*", "Here is what I am *building.*"), the founder quotes,
  numerals and the venture-name ticker. In any `AnimatedText` heading, wrap
  words in `*asterisks*` to set them in the serif.
- A small gold ornament (hairline, diamond, hairline) on the closing panel.
- Thin gold rules on the ticker band, a gold opening quote mark on the home
  quote, and a very faint paper grain on the hero panels.

## Animation (adapted from 21st.dev)
- **Soft Blur In**: section headings now lift out of a soft blur, word by word.
- **Spotlight Card**: the three "ways" cards on Home carry a soft light and a
  hairline edge that follow the pointer, in each card's own colour.
- **Animated Shiny Text**: a slow gold glint passes across the hero tagline
  every few seconds.
- All three respect "reduce motion".

## Fixes
- About page: the closing buttons were `<button>` inside `<a>`, which is
  invalid; they are now plain links.
- Contact page: the three intent cards were clickable `div`s that a keyboard
  could not reach; they are now real buttons that announce which is selected.
- Home: two sections pointed `aria-labelledby` at headings with no id.
- `package.json` is now `"type": "module"` (the config files were already ES
  modules).

---

# Previous pass


Same site, same theme (light, navy/gold, formal), with the motion from the
second zip brought over and a few real bugs fixed.

## Ventures page — rebuilt
Now the pinned, horizontal "chapters" from the second zip: one full screen per
venture, travelling sideways as you scroll, with a progress rail at the
bottom you can click to jump to any venture. On phones and with reduced
motion turned on, it becomes a simple stacked list instead.

Screenshots: the source zip only had three generic preview images for seven
ventures, so those three are reused (different venture, different crop) until
real screenshots are uploaded. Any venture with an `image_url` set in the
admin panel uses that image automatically instead — drop real screenshots in
`public/images/ventures/` and point `src/data/ventureMedia.js` at them, or
just upload through the admin panel.

## Services page — new
The site had no dedicated services page before. Built the coverflow carousel
from the second zip (drag or arrow keys) using the site's own colours. Since
services don't have real screenshots, each card gets a small drawn cover
(three flat "plates": identity, growth, structure) instead of a stock photo.

## Home page — rebuilt on the same content
Kept every section from the original (hero, three ways to get involved,
venture list, founder quote, closing CTA) and added the ticker, the
word-by-word quote reveal, the hover preview on the venture list, and the
closing panel that opens as you scroll — all from the second zip, restyled
for the light theme.

## Fixed
- The About page had five scroll animations wired to CSS-module class names
  (`.hero`, `.prose`, etc.), which are hashed at build time — so five
  animations on that page were silently never running. Fixed by giving those
  elements plain `data-trigger` attributes.
- Removed the three.js hero background and its four packages: it wasn't
  visible in the deployed build and shouldn't have been shipped.

## Housekeeping
- Self-hosted Inter and Outfit instead of loading them from Google Fonts.
- Logos and founder photo converted from ~5000px PNGs (100–800 KB each) to
  trimmed WebP.
- Brought over the icons, `robots.txt`, `sitemap.xml` and `vercel.json` from
  the second zip.

## Still using placeholder or missing data
- `src/api.js`: contact email/phone/social links ship blank — fill in the
  admin panel's Contact details tab, or `defaultContactSettings` if you're
  not using Supabase.
- Ventures without a real screenshot show one of the three generic previews
  (see above).
