# Round 4 (27 September 2026)

## Every page
- **Phones look the same on every phone.** The phone layout is set on iPhone 16 Pro Max (440 px). On narrower phones (iPhone 15 at 393, SE at 375, Android at 360) the whole page scales down in step, so line breaks and proportions match. Checked at 360, 375, 393, 430 and 440 px with no sideways scrolling. The full logo now shows on every phone. (`globals.css`, "Phones: one layout, scaled to the screen".)
- **The closing "P.Sonkar" is shown in full** on every page and screen size. Its size is worked out from the screen width, and its rise-in animation always finishes fully visible.
- **Even spacing between sections.** One spacing value (`--section-padding-y` in `variables.css`) is used by every section on every page, and it is smaller than before.
- Footer link "About the founder" renamed "About Me", as in the site content.

## Home
- **Phone opening screen fits on one screen on every phone:** tagline, name, both buttons, the photo from head to knees inside its circle, and the "A founder-led ecosystem" block with Get involved all show above the tab bar. The photo shrinks to fit the space left and is never cropped. Checked at 360x740, 375x667, 375x812, 393x660 (iPhone 15 with Safari's bars), 393x852, 430x932, 440x830 and 440x956.
- Tagline oval: only the turning gold outline is removed. The soft highlight drifting across it and the gold glint over the words stay.
- **Fixed: the circle behind the photo drifted off to the right** as soon as the mouse moved over the hero (the pointer effect overwrote the CSS that centred it). It is now centred without a transform and stays behind the photo.
- Ring behind the photo: the coin icon is now a hand with coins (fundraising), and the growth arrow is now a rising bar chart.
- Space added between the venture name banner and the KPI cards.
- Venture cards: photo, name and "Explore" only. Each card opens that venture on the Ventures page (links like `/ventures#rise-for-change`).
- Closing panel: View My Ventures, Explore Services, Get Involved.
- Copy restored to the site content: "What This Is About", "View All Ventures", "Based in Bangalore." and the closing line "Whether you want to invest, join a team, or grow your business...".
- Removed the "How it works" section (its three steps were not in the site content).

## About
- Photo is the one from the previous site.
- Closing buttons: View My Ventures, Explore Services, Get Involved.

## Ventures
- Intro text: "Two categories. In-House Ventures are built and operated by me directly. Collaborated Services are engagements I am part of through active partnerships."
- **Phone fix:** the 01 to 07 rail no longer floats up when Safari's bars hide on scroll. It is fixed just above the tab bar and moves with it, and it hides once you scroll past the ventures.
- Removed the made-up sector labels. Buttons read "Enquire about this venture" and "Visit Website" (shown only when a website is set). Closing: "See something that interests you?" with the site's sub-text and Get Involved.

## Services
- Heading, text and closing now use the site's own Collaborated Services copy. Removed the made-up "Focus" and "Works with" lines. Button: "Enquire about this service".

## Get Involved
- Back A Venture icon is the fundraising hand with coins; Grow Your Business uses the same growth chart as the home ring.

---

# Round 3 (27 September 2026): the 30-point change list

## Every page
- **Logo intro on first load.** Opening the site shows the PS logo on the navy screen (the same screen used between pages), then lifts. `index.html` paints a copy before any JavaScript runs, so there is no white flash. Home's entrance animation now starts after the logo lifts.
- **Page-change screen has texture.** Gold and white semicircles on the right edge (slowly turning, with small gold beads), a smaller set bottom left, a thin gold frame and grain. It now covers the header and phone tab bar too (it used to sit under them).
- **Semicircles on every page.** The same `Arcs` component sits on the right of the Home, About, Services and Get Involved opening panels and in the closing panels.
- **Light blue tint** replaces plain white across Home, About, Services and Get Involved (`--color-tint`, `--color-bg-secondary`, `--color-bg-hero` in `variables.css`).
- **Footer:** the closing "P.Sonkar" is now large, left-aligned and cut off by the bottom and right edges, as in the reference. It stays clear of the phone tab bar.
- **Footer contact:** Name, Phone, Email and Place, each labelled. Phone and email come from the admin panel (Contact details tab) and show once filled in there.
- **Instagram, LinkedIn and X icons** in the footer, linked. They use the admin panel links; until those are set they fall back to the handles in the site spec (@psonkarventures, /in/pratapsonkar, @pratapsonkar).

## Home
- Tagline in a liquid-glass oval with a moving gold outline. Always one line: on phones the type scales with the screen width (checked at 375, 390, 430 and 440 px).
- "Explore ventures" and "Explore services" side by side under the name (also side by side on phones).
- "Get involved" button under "A founder-led ecosystem"; "Read my story" removed from there. On laptops that text sits on frosted glass so the ring icons pass behind it cleanly.
- Eight start-up icons (rocket, bulb, growth, target, handshake, team, coins, megaphone) ride the rotating gold ring behind the photo and stay upright.
- Venture ticker: never stops or reverses, runs at the same 64 px per second on phone and laptop (phone was 35), scrolling only speeds it up. Slightly smaller type on phones so more names show.
- KPI strip under the ticker: 5 In-house ventures, 10+ Services, 15+ Venture collaborations, 100% Impact driven, counting up once. Edit the numbers in `KPIS` at the top of `src/app/page.jsx`.
- New "Here is what I am building" section before "Three ways to be part of this": venture cards that scroll by themselves, pause on hover or touch, can be swiped, and link to that venture on the Ventures page.
- Closing panel: one "Get Involved" button instead of three.
- Phones: "Read my story" now sits below the quote.

## About
- Photo added in the opening panel (arched light-blue frame, gold ring, name tag).
- Much less empty space above and below the paragraphs.
- "In my own words" is now a full-width navy card with a gold frame, large serif quote and a signature line.

## Services
- Cards move on by themselves every 15 seconds (`AUTOPLAY_MS` in `src/app/services/page.jsx`). Hovering pauses; any arrow, dot or drag restarts the wait.
- Left and right arrows sit right beside the centre card on laptop and phone.
- Instagram-style dots (one per card, current one blue) sit between the cards and their details.

## Ventures
- Phones now get the same sideways travel as you scroll down, with a numbered progress rail above the tab bar. Only "reduce motion" stacks the chapters.
- Links like `/ventures#chapter-2` (used by the home cards) jump to that venture.

## Get Involved
- Cards and dropdown renamed: Back A Venture, Join The Team, Grow Your Business. Links like `/contact?intent=grow` pre-select the right one.
- **Phone dropdown fix:** the native iPhone picker was drawn over the wrong field on this animated page. All dropdowns are now a custom list that always opens directly under its field (keyboard accessible, still `required`).
- **Bug fixed:** choosing "Join The Team" crashed the page (venture objects were rendered as text). The venture checkboxes now work and are included in the message.
- The email or WhatsApp message now includes the extra answers (role, stage, needs, ventures, link).

---

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
