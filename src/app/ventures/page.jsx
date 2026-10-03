import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { getImageUrl, getSiteSettings, getVentures } from '@/api';
import { defaultSiteSettings } from '@/data/siteContent';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { ventureMedia, ventureSlug } from '@/data/ventureMedia';
import styles from './page.module.css';
import ContactModal from '@/components/ui/ContactModal';

/*
  Ventures, told as chapters.
  Each venture fills the whole screen with its picture, and its story is set
  over the picture on a navy gradient. On desktop the page pins and the
  chapters travel sideways as you scroll, with each picture drifting a little
  slower than its chapter for depth. A rail at the bottom shows progress and
  jumps to any venture. Phones get the same sideways travel as you scroll
  down; only reduced motion stacks the chapters.
*/

const pad = (n) => String(n + 1).padStart(2, '0');

// Which venture a link like /ventures#guideshaala (or the older #chapter-2) points at
function hashIndex(hash, ventures) {
  const id = decodeURIComponent((hash || '').replace(/^#/, ''));
  if (!id) return -1;
  const legacy = id.match(/^chapter-(\d+)$/);
  if (legacy) return Math.min(Number(legacy[1]), ventures.length - 1);
  return ventures.findIndex((venture) => ventureSlug(venture.name) === id);
}

function uniqueByName(items) {
  const seen = new Set();
  return items.filter((item) => {
    const name = (item.name || '').trim().toLowerCase();
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

export default function VenturesPage() {
  const [ventures, setVentures] = useState([]);
  const [copy, setCopy] = useState(defaultSiteSettings.pages.ventures);
  const [contactSubject, setContactSubject] = useState('');
  const [active, setActive] = useState(-1); // -1 = the intro panel
  const [pinned, setPinned] = useState(true); // phones: the rail shows only while the chapters are pinned
  const root = useRef(null);
  const trackRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getVentures().then((rows) => {
      if (alive) setVentures(uniqueByName(rows.filter((row) => row.is_active !== false)));
    });
    getSiteSettings().then((settings) => setCopy(settings.pages.ventures));
    return () => { alive = false; };
  }, []);

  useLayoutEffect(() => {
    if (!ventures.length) return undefined;
    const mm = gsap.matchMedia();

    mm.add({
      horizontal: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { horizontal } = context.conditions;
      const panels = gsap.utils.toArray('[data-panel]', root.current);
      const chapters = gsap.utils.toArray('[data-chapter]', root.current);

      // Intro headline rises out of a mask on arrival
      const introTitle = root.current.querySelector('[data-intro-title]');
      if (introTitle) {
        const split = SplitText.create(introTitle, { type: 'words', mask: 'words' });
        gsap.from(split.words, { yPercent: 110, duration: 1.1, stagger: 0.09, ease: 'expo.out', delay: 0.25 });
        gsap.from('[data-intro-copy]', { opacity: 0, y: 24, duration: 1, stagger: 0.12, ease: 'expo.out', delay: 0.6 });
      }

      if (horizontal) {
        const track = trackRef.current;
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            pin: '[data-pin]',
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.6,
            // One scroll = one slide: the page glides to the next (or previous)
            // venture in the direction you scrolled and settles on it
            snap: {
              snapTo: 1 / Math.max(1, panels.length - 1),
              directional: true,
              inertia: false,
              delay: 0.04,
              duration: { min: 0.45, max: 0.9 },
              ease: 'power2.inOut',
            },
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onToggle: (self) => setPinned(self.isActive),
            onUpdate: (self) => {
              const index = Math.round(self.progress * (panels.length - 1)) - 1;
              setActive(index);
              gsap.set('[data-rail-fill]', { scaleX: self.progress });
            },
          },
        });
        triggerRef.current = tween.scrollTrigger;

        // Arriving from a venture card on the home page (/ventures#guideshaala)
        const target = hashIndex(window.location.hash, ventures);
        if (target >= 0) {
          window.setTimeout(() => {
            const st = tween.scrollTrigger;
            const total = Math.max(1, panels.length - 1);
            st.refresh();
            window.scrollTo({ top: st.start + (st.end - st.start) * ((target + 1) / total), behavior: 'auto' });
          }, 700);
        }

        chapters.forEach((panel) => {
          const along = { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true };
          // The picture drifts against the chapter and settles from a slight zoom
          gsap.fromTo(panel.querySelector('[data-chapter-image]'), { xPercent: 7, scale: 1.12 }, {
            xPercent: -7, scale: 1.02, ease: 'none', scrollTrigger: along,
          });
          // The gradient opens a little as the chapter arrives
          gsap.fromTo(panel.querySelector('[data-scrim]'), { opacity: 1 }, {
            opacity: 0.86, ease: 'none',
            scrollTrigger: { ...along, end: 'left left' },
          });
          const title = panel.querySelector('[data-chapter-title]');
          if (title) {
            const split = SplitText.create(title, { type: 'words', mask: 'words' });
            gsap.from(split.words, {
              yPercent: 110, stagger: 0.07, ease: 'none',
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 82%', end: 'left 40%', scrub: true },
            });
          }
          gsap.from(panel.querySelectorAll('[data-chapter-copy]'), {
            opacity: 0, y: 30, stagger: 0.09, ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 72%', end: 'left 34%', scrub: true },
          });
        });
      }
    }, root);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    // Reduced motion stacks the chapters: a plain jump to the linked venture
    let stackedJump = 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const target = hashIndex(window.location.hash, ventures);
      if (target >= 0) {
        stackedJump = window.setTimeout(() => {
          document.getElementById(ventureSlug(ventures[target].name))?.scrollIntoView({ block: 'start' });
        }, 300);
      }
    }
    return () => { window.clearTimeout(refresh); window.clearTimeout(stackedJump); mm.revert(); triggerRef.current = null; };
  }, [ventures.length]);

  const jumpTo = (index) => {
    const st = triggerRef.current;
    if (!st) {
      document.getElementById(ventureSlug(ventures[index]?.name))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const total = Math.max(1, ventures.length); // panels - 1, counting the intro
    window.scrollTo({ top: st.start + (st.end - st.start) * ((index + 1) / total), behavior: 'smooth' });
  };

  return (
    <div ref={root} className={styles.page}>
      <div className={styles.pin} data-pin>
        <div ref={trackRef} className={styles.track}>
          <section className={`${styles.intro} grain`} data-panel aria-label="Introduction">
            <div className={styles.introInner}>
              <p className={styles.introKicker} data-intro-copy>{copy.introLabel}</p>
              <h1 className={styles.introTitle} data-intro-title>{copy.introTitle}</h1>
              <p className={styles.introText} data-intro-copy>{copy.introText}</p>
            </div>
            <p className={styles.introCue} aria-hidden="true"><span />Scroll to explore</p>
          </section>

          {ventures.map((venture, index) => {
            const media = ventureMedia(venture, index);
            const uploaded = Boolean(venture.image_url);
            const image = uploaded ? getImageUrl(venture.image_url) : media.src;
            const kind = uploaded ? 'screenshot' : media.kind;
            return (
              <section
                key={venture.id || venture.name}
                id={ventureSlug(venture.name)}
                className={styles.chapter}
                data-kind={kind}
                data-panel
                data-chapter
                aria-label={venture.name}
              >
                {kind === 'screenshot' ? (
                  // A website screenshot is kept sharp: a large browser window,
                  // tilted slightly and running off the edge of a navy chapter
                  <div className={styles.media}>
                    <div className={styles.deviceWrap} data-chapter-image>
                      <div className={styles.device}>
                        <div className={styles.deviceBar} aria-hidden="true"><span /><span /><span /></div>
                        <img
                          src={image}
                          alt={media.alt || `${venture.name} website`}
                          loading={index < 2 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.media}>
                    <img
                      className={styles.mediaImage}
                      data-chapter-image
                      src={image}
                      srcSet={media.srcSet}
                      sizes="100vw"
                      alt={media.alt || ''}
                      style={{ objectPosition: media.position }}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                )}
                <span className={styles.scrim} data-scrim aria-hidden="true" />

                {media.credit && (
                  <a
                    className={styles.credit}
                    href={`${media.creditUrl}?utm_source=psonkar_ventures&utm_medium=referral`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Photo, {media.credit} / Unsplash
                  </a>
                )}

                <div className={styles.chapterInner}>
                  <div className={styles.copy}>
                    <p className={styles.index} data-chapter-copy>
                      <span className={styles.indexNum}>{pad(index)}</span>
                      <span className={styles.count}>of {pad(ventures.length - 1)}</span>
                    </p>
                    <h2 className={styles.title} data-chapter-title>{venture.name}</h2>
                    <p className={styles.text} data-chapter-copy>{venture.description}</p>
                    <div className={styles.links} data-chapter-copy>
                      <button type="button" onClick={() => setContactSubject(venture.name)} className={styles.primaryLink}>
                        Enquire about this venture <ArrowUpRight size={16} aria-hidden="true" />
                      </button>
                      {venture.website_url && (
                        <a href={venture.website_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                          Visit Website <ExternalLink size={15} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {ventures.length > 0 && (
          <nav className={`${styles.rail} ${active >= 0 ? styles.railOnImage : ''} ${pinned ? '' : styles.railHidden}`} aria-label="Ventures">
            <span className={styles.railTrack} aria-hidden="true"><span className={styles.railFill} data-rail-fill /></span>
            <ul>
              {ventures.map((venture, index) => (
                <li key={venture.id || venture.name}>
                  <button
                    type="button"
                    onClick={() => jumpTo(index)}
                    className={index === active ? styles.railActive : styles.railButton}
                    aria-current={index === active ? 'true' : undefined}
                  >
                    <span className={styles.railNum}>{pad(index)}</span>
                    <span className={styles.railName}>{venture.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <section className={styles.tail}>
        <div className={styles.tailInner}>
          <div className={styles.tailCopy}>
            <h2 className={styles.tailTitle}>{copy.tailTitle}</h2>
            <p className={styles.tailText}>{copy.tailText}</p>
          </div>
          <div className={styles.tailActions}>
            <Link to="/contact" className={styles.tailButton}>Get Involved <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link to="/services" className={styles.tailLink}>Explore Services</Link>
          </div>
        </div>
      </section>
      <ContactModal open={Boolean(contactSubject)} subject={contactSubject} onClose={() => setContactSubject('')} />
    </div>
  );
}
