# Redesign changes (16 September 2026)

Run it:

```bash
npm install
npm run dev
```

Without Supabase variables in `.env`, the site now shows the 7 ventures and 3 partner services from `src/data/portfolio.js` (copied from `supabase/schema.sql`). With Supabase configured, live data from the admin panel is used as before.

Note: some edited files were saved with LF line endings instead of CRLF, so `git status` may list more files than were really changed. Use `git diff --ignore-all-space` or `git diff -w` to see the real edits.

## Do these yourself (not fixable in code)

1. **Footer email.** The wrong Gmail on the live site is stored in Supabase (`contact_settings` row), not in the code. Change it in `/admin`, Contact details tab.
2. **Delete `public/images/founder.png` and `founder_transparent2.png`.** They show a different person, not Pratap.
3. **`venture-mockup-1/2/3.png` are AI-generated art.** No longer used. Upload real venture screenshots in the admin panel; the homepage shows them in a browser frame automatically.
4. **Confirm the email domain.** Old code used `psonkarventures.com`, the site is `psonkarhouseofventures.com`.
5. **Confirm venture counts.** The live site said "5 in-house ventures" and "15+ collaborations"; the database seed has 7 ventures and 3 services. The homepage now counts whatever is in the data.
6. **"Investor enquiries" wording.** Check with a CA or lawyer (Companies Act, Section 42) before promoting investment publicly.
7. **Logo as SVG.** If you get an SVG of the PS monogram, the intro can draw its strokes (GSAP DrawSVG). With a PNG it uses a mask reveal instead.

## Bugs fixed

- **Contact page crashed** (blank screen) when "Work" was selected once ventures loaded: venture objects were rendered as text. This bug was in the original code.
- Anchor links hid headings under the sticky header (`scroll-margin-top`).
- The page grid expanded to the width of its widest child, which would push content off-screen (`PageTransition.module.css`).
- Fake defaults removed: phone `+919876543210` and made-up social links no longer appear when settings are empty.
- Public "Admin" link not added; admin panel keeps its light theme.

## New files

| File | What it does |
|---|---|
| `src/components/background/SilkBackground.jsx` | Full-page WebGL silk background. Adapted from the 21st.dev "Silk" shader (component 24116), re-tuned to the brand navy, lit folds, reacts to scroll and cursor, pauses when hidden, lower resolution on phones, still frame for reduced motion. CSS gradient fallback without WebGL. |
| `src/components/motion/IntroCurtain.jsx` | Once-per-session intro: monogram mask reveal, wordmark letters, curtain lifts. Skipped for reduced motion. |
| `src/components/motion/introState.js` | Lets the hero wait for the intro. |
| `src/components/motion/Magnetic.jsx` | Magnetic pull on primary buttons (desktop only). |
| `src/data/portfolio.js` | Local fallback content with a short `sector` label per venture. Add a `sector` column in Supabase to manage it from admin. |
| `public/images/founder_cutout.webp` | Portrait re-exported: faint edge halo removed, 1.25 MB PNG to 104 KB. |
| `public/images/logo-white.webp`, `logomark-white.webp` | Trimmed, lightweight logos. |

## Homepage (`src/app/page.jsx`, rewritten)

| Section | Animation |
|---|---|
| Hero: full name, one plain sentence, one primary button | Letters rise out of a mask (SplitText); portrait wipes up; on scroll the name drifts and loosens while the portrait sinks |
| Venture name strip | Loops continuously, speeds up and reverses with scroll direction |
| What I am building (all ventures) | Pinned horizontal scroll on desktop, a clickable name rail with progress line, outlined initial parallax per venture, title words rise. Vertical stack on mobile and for reduced motion |
| Partner services | Divider lines draw across, rows lift in, hover slides the name and turns the arrow |
| Pratap's own quote (from the About page) | Words brighten one by one as you read down |
| Three ways to work together | Panels expand on hover or focus, stacked on mobile |
| Closing | Box opens from a thin band as it scrolls in |
| Footer | Large "P.Sonkar" wordmark rises into view |

## Site-wide

- Theme: ink navy tokens in `variables.css` (same variable names, so all pages adapted), serif Newsreader for headings to echo the logo, Instrument Sans for text. Fonts are self-hosted through `@fontsource-variable`.
- Removed AI tells: numbered 01/02/03 markers, "Image coming soon", "Website locked/private", Title Case headings with periods, gradient text, glossy buttons, decorative rings, all-caps section labels.
- Header: white logo, "Get in touch" primary button. Mobile tab bar labels shortened to "Ventures" and "Services".
- Contact page reads `?intent=invest|work|grow` from homepage links and scrolls to the form.

## Not done yet

- About, Ventures and Contact pages were re-themed and cleaned up, not redesigned. They still use the older card layouts.
- The unused three.js files (`src/components/three/`) remain; remove them and the `three`, `@react-three/*` packages if you do not plan to use them.
- Tested in headless Chromium only. Test on a real mid-range Android phone and in Safari before going live.

# Update: Version 4 homepage, contrast and 3D background (17 September 2026)

- **Contrast.** `--color-bg-primary` is solid `#050a11`. Light buttons, the header button, `::selection` and the closing box use `#0d1220` text. Also fixed `Button.module.css` `.primary`, which had white text on the light periwinkle accent.
- **Background video (`ScrollLockedVideoHero.jsx`).** Three-step GSAP timeline on `trigger: 'body'`, `end: 'max'`, perspective 1200, scale 1.04 to 2.6 with rotationX/Y/Z and x/yPercent. Now runs inside `gsap.context`, so unmounting reverts the transforms and kills the ScrollTrigger. The previous cleanup looked for `document.documentElement` and never matched the `'body'` trigger. Checked in a browser: the tilted video still covers every corner of the viewport from top to bottom of the page.
- **Hero (`ScrollLockedImageHero.jsx`).** Takes a `ctas` array, stacked in a flex column. Links starting with `/` use React Router. Title matches the spec ("House Of"); the stray `*` after the title was removed.
- **Homepage order now follows the Version 4 spec:** Hero, Three Pillars Strip, Ventures Snapshot, About Me Strip, Closing CTA. The name ticker and Partner services section are kept in between.
- **Three Pillars Strip.** Three cards side by side (stacked on mobile), each with Invest / Work / Grow label, heading, body and a visible "Get Involved" button to its Get Involved section.
- **Ventures Snapshot.** Added the spec's "View All Ventures" button.
- **"Explore Services" link fixed.** The services section had no `id="services"`, so the hero link went nowhere.
- Inline styles in `page.jsx` moved into `page.module.css`.

# Update: site-wide polish (17 September 2026)

The design, layout, copy and animations were not changed. These are under-the-hood improvements.

## Speed
- About, Ventures, Contact and the admin panel now load on demand, so the first visit only downloads the homepage. Main site code went from one 585 KB file to a 44 KB file plus separately cached library files (React, GSAP, Framer Motion, Supabase).
- Removed unused three.js code (`src/components/three`, `useGPUDetect`, `useScrollProgress`) and its 5 packages (58 packages removed from install).
- Deleted 8 unused images (about 3.7 MB): `Logo.png`, `Logomark.png`, `White logo.png`, `White logomark.png`, `founder.png`, `founder_transparent.png`, `founder_transparent2.png`, `founder_white_bg.png`. The admin panel now uses `logo-white.webp`.
- Background video pauses while the tab is hidden, and shows a still frame for visitors with Data Saver or reduced motion turned on.
- Kept `venture-mockup-1/2/3.png` in case live Supabase rows still point at them. Delete them once confirmed unused.

## Search and link previews
- `index.html`: spec homepage title and description, canonical URL, Open Graph and X/Twitter tags with a 1200x630 preview image (`public/og-image.jpg`), theme colour, and structured data (Organization + Person) for Google.
- Each page now sets its own title and description from `full_spec.txt`, and `/admin` is marked noindex.
- Added `robots.txt` (blocks /admin), `sitemap.xml`, and `site.webmanifest`.
- Replaced the default triangle favicon with the PS monogram (favicon, 192/512 icons, Apple touch icon).
- Headings built from animated word boxes (hero, About, Ventures, Contact) now contain real spaces, so search engines read "What I am building" instead of "WhatIambuilding". No visual change.
- All absolute URLs assume `https://psonkarhouseofventures.com`. Change them in `index.html`, `robots.txt` and `sitemap.xml` if the domain differs.

## Accessibility
- "Skip to content" link for keyboard users (appears on first Tab).
- Mobile menu button reports open/closed to screen readers and closes with Escape.
- Hero "Explore Ventures" / "Explore Services" links now scroll smoothly and stop below the header.

## Contact form
- Hidden honeypot field quietly discards most spam bots.
- "Reach out via WhatsApp" now checks required fields first (it used to skip validation).
- Name, email and phone fields support browser autofill.

## Hosting
- Added `public/_redirects` (Netlify) and `vercel.json` so direct links like `/about` do not 404 on those hosts.

## Cleanup
- Removed unused placeholder contact details (fake phone number) and an unused background image URL from `src/data/config.js`.

# Update: homepage-only, smoother camera (17 September 2026)

- The background zoom now runs only on the homepage. On About, Ventures, Services and Contact the video stays still at its resting frame. Leaving the homepage glides the camera back to rest during the page transition instead of snapping.
- Smoother motion: the zoom, the slide toward the laptop and the turn are now single long eased tweens that overlap, instead of three separate steps, and the scrub has more inertia (2 instead of 1.2). Measured in a browser, scale rises steadily at every 10% of scroll with no pauses or jumps.
- Subtler turn: 2.5 degrees (was 5), spread over most of the page. For a pure zoom with no turn, set `TURN_DEGREES = 0` at the top of `src/components/ui/ScrollLockedVideoHero.jsx`.
- Final zoom 2.6x (was 3.2x). Spotlight now fades with opacity only, which is cheaper for the browser than repainting a gradient on every scroll frame. Cinematic bars are thinner (5vh).

# Update: atmosphere on the homepage background (17 September 2026)

New file `src/components/background/AtmosphereLayer.jsx`: a WebGL mist layer painted over the background video on the homepage only. The mist shader is adapted from the 21st.dev "realistic fog background" component (id 9854), rebuilt as a transparent overlay and re-coloured to the video's dusk light. It never reads the video's pixels, so it works with a video hosted on another domain.

As you scroll the homepage:
- **0 to 30%: the island forms.** Cloud covers the frame except a small clearing on the hilltop, then parts outward with ragged, cloud-like edges and a faint warm rim of light.
- **40 to 70%:** a soft cloud bank drifts across in front of the camera.
- **15 to 100%:** fine dust motes float in the evening light and slide faster than the scene (parallax).
- **Always:** thin wisps drift at the edges, and scrolling stirs the mist.

Performance: renders at half resolution (40% on phones), pauses when the tab is hidden or you leave the homepage, and is turned off for reduced-motion users. The layer fades out when you navigate to another page.

Also fixed: the camera ScrollTrigger used `trigger: 'body'` inside a GSAP context scoped to the background, which logged "Element not found: body". It now passes `document.body` directly.

# Update: more atmosphere and a brighter background (17 September 2026)

Added to `AtmosphereLayer.jsx` (homepage only):
- **Sun shafts** falling from the bright clouds at the top right, strongest where they pass through mist (roughly 25 to 85% of the page). Adapted from the 21st.dev "God Rays" component (id 17973, from Paper Shaders, Apache-2.0).
- **Cursor pushes the mist aside** on desktop, following slowly so it drifts rather than snaps. Off on touch screens.
- **Closing mist:** in the last 8% of the page the mist rolls back in around the edges, bookending the opening reveal.
- **Very light film grain** where the layer draws.

Brighter background:
- Video filter `brightness(0.85) saturate(0.82)` changed to `brightness(1.02) saturate(0.95)`.
- Dark scrim reduced by about 20% (top 0.62 to 0.5, bottom 0.72 to 0.6, sides 0.58/0.52 to 0.46/0.4).
- End-of-page spotlight shadow reduced (0.85 to 0.7, softer gradient).

# Update: founder photos and a foggier opening (17 September 2026)

- **Homepage hero:** Pratap's suit photo (`founder_cutout.webp`, previously on About) now stands in the open space between the title and the tagline column. Its position is calculated from the hero grid, so no text sits over his face at 1280, 1440 or 1920 px widths. It emerges from a blur on load, has a band of fog drifting across his lower half, and on scroll drifts up and sinks back into the mist. On phones it is smaller, top-right and dimmed so the title stays readable.
- **About page:** now uses the black polo photo (`public/images/founder_polo.webp`). The background was removed with an AI cut-out tool (rembg), the leftover circle frame and "Founder-led" badge were cleaned off, and it is cropped chest-up with a soft fade. The only source was a 341 x 466 screenshot, so it was upscaled 2x and will look slightly soft on high-resolution screens. Replace it with the original photo file when available (same file name, transparent background).
- **Foggier opening:** the clearing on the hilltop starts smaller, the mist is slightly thicker and lighter in colour, and a light haze covers the whole frame at the top of the page, lifting during the first quarter of the scroll so the reveal is clearly noticeable.
- **Placement checks:** measured at 1024, 1280, 1366, 1440 and 1920 px wide, no heading, tagline or button overlaps either face. On the About page the heading now wraps "Founder." to a second line between 769 and 1380 px so it clears the photo, and the photo sits at the far right. On the homepage the torso fades into the mist earlier, so the large white title stays crisp over it.

# Version 5 build: new hero, photo-led ventures, services carousel (18 September 2026)

## Home page
- **Hero replaced with the 21st.dev "minimalist hero" template**, ported from Tailwind + TypeScript to this project's JSX + CSS Modules (`src/components/ui/MinimalistHero.jsx` and `.module.css`). Layout, spacing, sizes, the yellow circle, the animation timings and easings are the template's, unchanged. What changed: the photo is Pratap's studio portrait (`/images/founder_studio.webp`, background removed), and the copy is yours (logo P.Sonkar, real nav, real tagline, "ideas in / motion.", Bangalore, India). Since the studio shot is a square chest-up photo rather than a tall profile shot, it is sized up to fill the circle and fades softly at the chest so there is no hard cut.
- The template carries its own header, so the site header is hidden on the home page only. The hamburger opens a small menu on phones.
- **No venture list on the home page.** Order now: hero, venture name ticker, Pratap's quote, two doors (Ventures and Services), three ways to be part of this, closing.
- Social links in the hero footer appear only when those URLs are set in the admin panel. This version of lucide-react ships no brand icons, so they render as labels.

## Ventures page
- Rebuilt as a photo-led grid on a warm, light background (#f2efe8), so the site is not dark end to end. First card is full width, the rest are two up.
- **Each venture has its own background image and accent**, mapped in `src/data/media.js`. Sources: Unsplash and Pexels, both free for commercial use. If a remote image fails, the card falls back automatically to a locally generated plate in `/images/plates/`.
- Cards: sector label in the venture accent, name in the display serif, description, "Site coming soon" until a real URL exists, and an enquiry link. Hover zooms the photo 5 percent; cards clip-reveal upward as they enter.

## Services page
- New page at `/services` (it used to show the ventures page).
- **3D coverflow carousel**, ported from the 21st.dev "coverflow-carousel" component to JSX + CSS Modules. The drag physics, looping, tilt maths and keyboard handling are unchanged. Drag, arrow keys, dots and side buttons all work; the details sit underneath, like your reference.

## Notes
- Venture and service content still comes from Supabase, so the admin panel keeps working. Image priority: admin upload, then the mapped stock photo, then the local plate.
- Photos are hotlinked from Unsplash and Pexels. Before launch, download them into `/public/images/ventures/` and point `src` in `src/data/media.js` at the local files.

# Version 6: video removed, chapter ventures, smoother scroll (18 September 2026)

## Background video removed
- Deleted `ScrollLockedVideoHero.jsx`, `SilkBackground.jsx`, `AtmosphereLayer.jsx` and the intro curtain. Nothing loads that CDN video any more (checked in a browser: zero `<video>` elements on the page).
- Imagery now comes from photographs inside the pages instead of one video behind everything. The home page carries its own dark gradient field, plus a full-bleed parallax photo break between the quote and the two doors.

## Landing page load-in
- The hero fades in as a whole, then the parts land in order: circle, portrait (now revealed with a mask wipe from the bottom), copy block, display text, footer line. Timings follow the template's own delays, with the portrait reveal lengthened to 1.15s.

## Ventures: one screen per venture
- Rebuilt as chapters, in the style of charlesleclerc.com. Each venture fills the entire screen with its own photograph, with the number (01 / 06), sector, name, description and links over it.
- Desktop: the chapters move sideways as you scroll, pinned, with a chapter rail at the bottom (click any venture to jump) and a "Scroll to explore" cue. The photograph drifts slower than the panel, so there is depth without any 3D tilt.
- Phones and reduced motion: the same chapters stack as full-screen sections, each with a gentle vertical parallax.

## Smoother scrolling everywhere
- Lenis retuned: longer glide (1.6s), gentler easing curve, lerp 0.085, slightly softer wheel and firmer touch response, so the page carries momentum instead of stopping dead.
- Chapter scrub raised to 1.1 so the horizontal movement trails the scroll.

## Reference notes
- From the Ember site you sent: the reveal-on-scroll pattern, parallax photographs and the small caption pairs under image breaks.
- From charlesleclerc.com: numbered chapters, full-bleed image chapters with the copy sitting low on the left, the chapter rail and the "Scroll to explore" cue.

# Version 7: entry loader, no flat backgrounds, reveals (18 September 2026)

## Entry loader (new file `src/components/motion/Preloader.jsx`)
Modelled on charlesleclerc.com's gate and the 21st.dev "Loading Overlay" pattern (id 5654: count up, clip out, reveal). I searched 21st.dev for loader and scroll-reveal components and built from those patterns rather than downloading code, since the free retrieval quota for the day was used.
- Dark sheet with the PS monogram, the wordmark, a hairline that fills and a counter running 000 to 100 over 1.5s, then the sheet lifts away with a clip wipe.
- The hero starts while the sheet is still lifting, so the two overlap instead of queueing.
- Skipped entirely for prefers-reduced-motion; page scrolling is locked while it runs.

## The portrait now pops
The hero waits for the loader (`start` prop), then the circle and the portrait arrive on springs (stiffness 120 / 96, damping 14 / 13) with the portrait also wiping up from a mask. Copy, display text and footer follow on the template's own delays.

## No flat dark screens left
New `src/components/ui/PageBackdrop.jsx`: a full-bleed photographic backdrop with slow parallax and a scrim, in a page-wallpaper (fixed) or section variant.
- About: the desk and notebook photograph.
- Get Involved: the conversation photograph.
- Services: the misty valley photograph.
- Home: photographs now sit behind the quote section and the three-ways section as well as the existing image break.
- Each falls back to its local plate if the remote photo fails.

## Reveal on scroll everywhere
Any element marked `data-reveal` now rises in once as it enters view (900ms, expo curve, optional 2/3/4 stagger), re-armed on every route change. Applied to the About, Get Involved and Services sections. Disabled for reduced motion.

# Version 8: entrance order fixed, distinct brighter backgrounds (18 September 2026)

## Landing page entrance
- **The counter loader is gone.** The page simply loads and the hero animates in.
- **Real sequence, in this order:** header lockup and nav, the yellow circle easing open, the portrait rolling up out of the circle and overlapping it, then the copy, then the display text behind the portrait, then the footer line.
- **Bug found and fixed:** the hero's Framer Motion entrance never actually played. The page sits inside an `AnimatePresence initial={false}`, which makes Framer skip mount animations for everything inside it, so the hero was rendering at its finished state. The entrance now runs on GSAP, which is not affected. Measured in a browser: at about 0.7s only the circle is on screen, at about 1.4s the portrait is rolling up, and the display text follows.
- A side effect of that same bug was that Framer had been overwriting the template's `scale-150` on the photo. With GSAP the scale stays, so the portrait now genuinely overlaps the circle instead of sitting inside it.
- The display text sits behind the portrait in the stack and is pulled in just enough to tuck under it without covering a letter.

## Backgrounds
- **No repeated images.** Each surface has its own photograph: home image break (misty valley), home quote (sunlight through trees), home three-ways (workbench), About (desk and notebook), Get Involved (conversation), Services (light trails), plus one per venture chapter.
- **Brighter:** photographs now carry `brightness(1.1)` with lighter scrims (page scrim from 0.82/0.7/0.9 down to 0.68/0.46/0.8, venture chapters from 0.62/0.12/0.88 to 0.5/0.04/0.82) and weaker colour tints, so the images read rather than hint.

## Packaging
The zip now contains only what the site needs: `src`, `public`, `supabase`, `index.html`, configs, README and this change log. Left out: `.git`, `.claude`, `.agents`, `AGENTS.md`, `CLAUDE.md`, `skills-lock.json`, `brag-output`, `dist` and `node_modules`.

# Version 9: statement band, new photos, ambience (18 September 2026)

## The blank band is now a statement section
The empty strip between the quote and the two doors is a full section: a bright photograph, the eyebrow "(Ideas in motion)", the line "Small ventures, built properly, one at a time." with the last words in gold italic, a vertical "Ventures in progress" label down the right edge, and a caption row. Motion: the band's corners open out as it enters (clip-path scrub), the words rise out of a mask one by one, and the photograph drifts slower than the page.

## Photographs replaced
- **Impactshaala:** the man at a desk is gone. It now uses a bright photo of young people working together around a table, which suits a careers platform.
- **About:** its own photograph (people working in a city cafe) instead of sharing the desk image.
- **Statement band:** a third, separate photo (a team seen from above).
No photograph is used on two surfaces now.

## Ambience, from the Ember coffee site
New `src/components/motion/Ambience.jsx`:
- Fine film grain over the whole site (4.5 percent opacity, slow 6-step shift).
- A soft brass light that trails the cursor with easing. Desktop pointers only.
Both are decorative, ignore pointer events, and switch off for reduced motion.

## Smoother
Reveal transitions lengthened to 1.1s on the expo curve with a wider stagger (110 / 220 / 330ms).

## Reference pass
This build continues from the review of landonorris.com and charlesleclerc.com earlier in the project: the chapter rail, numbered chapters and "scroll to explore" cue on Ventures, and now the full-bleed statement band with a vertical label and caption row, which is how both of those sites break up long pages.

# Version 10: entry loader and living hero (18 September 2026)

## Loader (`src/components/motion/Loader.jsx`)
Modelled on the gate at landonorris.com, without a percentage counter: the monogram rises, "HOUSE OF VENTURES" letters climb out of a mask one by one, a gold hairline fills across, then the sheet splits in two and both halves leave. About 2.4s end to end. Shows once per browser session, skipped for reduced motion, and the hero entrance begins while the halves are still moving so the two overlap.

## Hero animations
- **Entrance:** circle opens, dashed ring follows, the portrait rolls up out of the circle, then the copy, then the heading lines rise out of a mask, then the footer line.
- **A dashed ring** now sits around the yellow circle and turns slowly (one revolution every 48 seconds).
- **Breathing:** the portrait and the circle drift up and down a few pixels on different cycles, so the composition is never completely still.
- **Cursor parallax:** the portrait leans toward the pointer (16px), the circle moves against it (9px) and the ring further still (16px), each with its own easing. Desktop pointers only.
- **Hover:** the photo brightens slightly and the ring warms.
- **On scroll:** the photo lifts and grows a little, the circle and ring sink, the heading drifts up and dims, and the copy block clears out. All scrubbed, so it tracks the scroll rather than firing.
- The heading keeps the template's two-line break (lines are split for the reveal, with nowrap so it never re-wraps).

All of it is skipped when prefers-reduced-motion is on.

# Version 11 (final): loader removed, brighter photos, polish (18 September 2026)

## Removed
The entry loader is gone. The page loads straight into the hero, whose own sequence (circle, ring, portrait rolling up, copy, heading lines, footer) plays on arrival.

## Photographs
- **Services:** the long-exposure light-trail shot (the one that read as a galaxy) is replaced with a bright photo of a team working together in an office, which actually matches design, marketing and legal partners.
- **Evntra:** also moved off a light-trail shot, on to people gathered at an outdoor venue in the evening.
- Every surface still has its own image, none repeated: statement band, home quote, home three-ways, About, Get Involved, Services, and one per venture chapter.
- **Brighter again:** page backdrops now `brightness(1.22)` (from 1.12) with scrims cut to 0.6 / 0.34 / 0.74, venture chapters `brightness(1.2)`, colour tints down to 0.28 to 0.3.

## Added, from 21st.dev
A hairline **scroll progress bar** across the top of the window, gold fading to off-white, following the 21st.dev "Scroll Progress" pattern (id 18717) but written without its Tailwind and Framer dependencies: one transform per animation frame, driven by a passive scroll listener.

## Optimisation
- `preconnect` and `dns-prefetch` for images.pexels.com and images.unsplash.com, so the first photo request does not wait on a fresh connection.
- The hero portrait is preloaded with high priority.
- Every image now decodes asynchronously (`decoding="async"`), so a large photo cannot block a frame while the page animates.
- Route-level code splitting keeps the first load at about 44 kB of site code plus separately cached vendor chunks (React 230 kB, GSAP 139 kB, Motion 130 kB).

## Checked in a browser
Build and lint clean. No JavaScript errors on any route. Loader gone, progress bar reaches full width at the bottom of the page, all five pages render, mobile has no sideways overflow.
