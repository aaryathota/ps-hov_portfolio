import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { getImageUrl, getVentures } from '@/api';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { mediaFor } from '@/data/media';
import styles from './page.module.css';

/*
  Ventures, told as chapters (the charlesleclerc.com pattern).
  Each venture fills the whole screen with its own photograph. On desktop the
  chapters move sideways as you scroll, with a chapter rail and a scroll cue.
  On phones and for reduced motion they stack as full-screen sections.
*/

const pad = (n) => String(n + 1).padStart(2, '0');

export default function VenturesPage() {
  const [ventures, setVentures] = useState([]);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const trackRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getVentures().then((rows) => {
      if (alive) setVentures(rows.filter((row) => row.is_active !== false));
    });
    return () => { alive = false; };
  }, []);

  useLayoutEffect(() => {
    if (!ventures.length) return undefined;
    const mm = gsap.matchMedia();

    mm.add({
      desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
      handheld: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { desktop } = context.conditions;
      const panels = gsap.utils.toArray('[data-chapter]', root.current);

      if (desktop) {
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
            scrub: 1.1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const index = Math.round(self.progress * (panels.length - 1));
              setActive(index);
              gsap.set('[data-rail-fill]', { scaleX: self.progress });
            },
          },
        });
        triggerRef.current = tween.scrollTrigger;

        panels.forEach((panel) => {
          // Photograph drifts slower than the panel: depth without tilting
          gsap.fromTo(panel.querySelector('[data-chapter-image]'), { xPercent: 12, scale: 1.14 }, {
            xPercent: -12, scale: 1.06, ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          });
          const title = panel.querySelector('[data-chapter-title]');
          if (title) {
            const split = SplitText.create(title, { type: 'words', mask: 'words' });
            gsap.from(split.words, {
              yPercent: 110, stagger: 0.07, ease: 'none',
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 82%', end: 'left 42%', scrub: true },
            });
          }
          gsap.from(panel.querySelectorAll('[data-chapter-copy]'), {
            opacity: 0, y: 34, stagger: 0.09, ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 72%', end: 'left 38%', scrub: true },
          });
        });
      } else {
        panels.forEach((panel, index) => {
          gsap.fromTo(panel.querySelector('[data-chapter-image]'), { yPercent: -6, scale: 1.12 }, {
            yPercent: 6, scale: 1.06, ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
          });
          ScrollTrigger.create({
            trigger: panel,
            start: 'top 60%',
            end: 'bottom 40%',
            onToggle: (self) => { if (self.isActive) setActive(index); },
          });
        });
      }
    }, root);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(refresh); mm.revert(); triggerRef.current = null; };
  }, [ventures.length]);

  const jumpTo = (index) => {
    const st = triggerRef.current;
    if (!st) {
      document.getElementById(`chapter-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const total = Math.max(1, ventures.length - 1);
    window.scrollTo({ top: st.start + (st.end - st.start) * (index / total), behavior: 'smooth' });
  };

  return (
    <div ref={root} className={styles.page}>
      <div className={styles.pin} data-pin>
        <div ref={trackRef} className={styles.track}>
          {ventures.map((venture, index) => {
            const media = mediaFor(venture.name) || {};
            const image = venture.image_url ? getImageUrl(venture.image_url) : media.src || media.fallback;
            return (
              <section
                key={venture.id || venture.name}
                id={`chapter-${index}`}
                className={styles.chapter}
                data-chapter
                aria-label={venture.name}
              >
                <div className={styles.chapterMedia}>
                  <img
                    className={styles.chapterImage}
                    data-chapter-image
                    src={image}
                    alt={media.alt || `${venture.name} background`}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    onError={(event) => {
                      if (media.fallback && !event.currentTarget.src.endsWith(media.fallback)) event.currentTarget.src = media.fallback;
                    }}
                  />
                  <span className={styles.chapterScrim} />
                  <span className={styles.chapterTint} style={{ background: media.tint || 'rgba(10, 13, 24, 0.42)' }} />
                </div>

                <div className={styles.chapterInner}>
                  <p className={styles.chapterIndex} data-chapter-copy>
                    <span style={{ color: media.accent || '#e7e2d6' }}>{pad(index)}</span>
                    <span className={styles.chapterCount}>/ {pad(ventures.length - 1)}</span>
                  </p>
                  {venture.sector && (
                    <p className={styles.chapterSector} data-chapter-copy style={{ color: media.accent || '#e7e2d6' }}>{venture.sector}</p>
                  )}
                  <h2 className={styles.chapterTitle} data-chapter-title>{venture.name}</h2>
                  <p className={styles.chapterText} data-chapter-copy>{venture.description}</p>
                  <div className={styles.chapterLinks} data-chapter-copy>
                    {venture.website_url ? (
                      <a href={venture.website_url} target="_blank" rel="noopener noreferrer" className={styles.chapterLink}>
                        Visit the site <ExternalLink size={15} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className={styles.chapterSoon}>Site coming soon</span>
                    )}
                    <Link to={`/contact?venture=${encodeURIComponent(venture.name)}`} className={styles.chapterLink}>
                      Ask about this venture <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {ventures.length > 0 && (
          <nav className={styles.rail} aria-label="Chapters">
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
            <p className={styles.scrollCue}>Scroll to explore</p>
          </nav>
        )}
      </div>

      <section className={styles.tail}>
        <p className={styles.tailEyebrow}>The Portfolio</p>
        <h2 className={styles.tailTitle}>Want to be part of one of these?</h2>
        <Link to="/contact" className={styles.tailButton}>Get in touch <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
