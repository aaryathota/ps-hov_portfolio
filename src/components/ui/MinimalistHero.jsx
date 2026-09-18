import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import styles from './MinimalistHero.module.css';

/*
  Minimalist hero, ported from the 21st.dev "minimalist-hero" component.
  The original is Tailwind + TypeScript; the classes live in
  MinimalistHero.module.css here, one for one, so the layout and sizes are
  the template's. The only content change is the photo.

  The entrance runs on GSAP rather than Framer Motion: the page is wrapped in
  an AnimatePresence with initial={false}, which makes Framer skip mount
  animations for everything inside it.

  Order on load:
    1. header lockup and nav
    2. the yellow circle eases open
    3. the portrait rolls up out of the circle and overlaps it
    4. the copy, then the display text behind the portrait, then the footer
*/

const NavLink = ({ href, children }) =>
  href.startsWith('/') ? (
    <Link to={href} className={styles.navLink}>{children}</Link>
  ) : (
    <a href={href} className={styles.navLink}>{children}</a>
  );

export default function MinimalistHero({
  logoText = 'P.Sonkar',
  navLinks = [],
  mainText,
  readMoreLink = '/about',
  readMoreLabel = 'Read More',
  imageSrc = '/images/founder_studio.webp',
  imageAlt = 'Pratap Sonkar',
  overlayText = { part1: 'ideas in', part2: 'motion.' },
  socialLinks = [],
  locationText = 'Bangalore, India',
}) {
  const root = useRef(null);
  const timeline = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Entrance, then the living bits: a slow float, a turning ring, cursor
     parallax and a scroll-driven drift. Ordered so the circle opens, the
     portrait rolls up out of it, then the words land behind the portrait. */
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context((self) => {
      const q = self.selector;
      const parts = [q('[data-h-top]'), q('[data-h-circle]'), q('[data-h-ring]'), q('[data-h-portrait]'), q('[data-h-copy]'), q('[data-h-display]'), q('[data-h-foot]')];

      if (reduce) {
        gsap.set(parts, { opacity: 1, clearProps: 'transform,clipPath' });
        return;
      }

      // lines only: the heading keeps the template's two-line break
      const heading = SplitText.create(q('[data-h-display] h1'), { type: 'lines', mask: 'lines' });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      tl.fromTo(q('[data-h-top]'), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.05)
        .fromTo(q('[data-h-circle]'), { opacity: 0, scale: 0.84 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, 0.2)
        .fromTo(q('[data-h-ring]'), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, 0.35)
        .fromTo(q('[data-h-portrait]'),
          { opacity: 0, yPercent: 26, clipPath: 'inset(100% 0% 0% 0%)' },
          { opacity: 1, yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.out' }, 0.7)
        .fromTo(q('[data-h-copy]'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 }, 1.45)
        .set(q('[data-h-display]'), { opacity: 1 }, 1.5)
        .from(heading.lines, { yPercent: 118, duration: 1.15, stagger: 0.1 }, 1.55)
        .fromTo(q('[data-h-foot]'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 1.85);
      timeline.current = tl;
      tl.play();

      // the ring turns slowly, for as long as the hero is on screen
      gsap.to(q('[data-h-ring]'), { rotation: 360, duration: 48, ease: 'none', repeat: -1 });

      // portrait and circle breathe, very slightly and out of step
      gsap.to(q('[data-h-portrait]'), { y: -10, duration: 5.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(q('[data-h-circle]'), { y: 8, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      // scroll: the photo lifts and the words drift the other way
      gsap.to(q('[data-h-portrait]'), {
        yPercent: -9, scale: 1.05, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to([q('[data-h-circle]'), q('[data-h-ring]')], {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to(q('[data-h-display]'), {
        yPercent: -16, opacity: 0.35, ease: 'none',
        scrollTrigger: { trigger: root.current, start: '15% top', end: 'bottom top', scrub: 1 },
      });
      gsap.to(q('[data-h-copy]'), {
        y: -40, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: '10% top', end: '70% top', scrub: 1 },
      });
    }, root);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(refresh); timeline.current = null; ctx.revert(); };
  }, []);

  /* Cursor parallax: the photo leans toward the pointer, the circle away */
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const node = root.current;
    if (!node || !fine || reduce) return undefined;

    const portrait = node.querySelector('[data-h-portrait]');
    const circle = node.querySelector('[data-h-circle]');
    const ring = node.querySelector('[data-h-ring]');
    const move = {
      portrait: gsap.quickTo(portrait, 'x', { duration: 0.8, ease: 'power3.out' }),
      circle: gsap.quickTo(circle, 'x', { duration: 1.1, ease: 'power3.out' }),
      ring: gsap.quickTo(ring, 'x', { duration: 1.4, ease: 'power3.out' }),
    };

    const onMove = (event) => {
      const offset = (event.clientX / window.innerWidth - 0.5) * 2;
      move.portrait(offset * 16);
      move.circle(offset * -9);
      move.ring(offset * -16);
    };
    const onLeave = () => { move.portrait(0); move.circle(0); move.ring(0); };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={root} className={styles.hero}>
      <header className={styles.header}>
        <div className={styles.logo} data-h-top>{logoText}</div>

        <nav className={styles.nav} aria-label="Main">
          {navLinks.map((link) => (
            <span key={link.label} data-h-top>
              <NavLink href={link.href}>{link.label}</NavLink>
            </span>
          ))}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="hero-menu"
          onClick={() => setMenuOpen((open) => !open)}
          data-h-top
        >
          <span /><span /><span />
        </button>
      </header>

      {menuOpen && (
        <nav id="hero-menu" className={styles.mobileMenu} aria-label="Menu">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
          ))}
        </nav>
      )}

      <div className={styles.main}>
        <div className={styles.left} data-h-copy>
          <p className={styles.mainText}>{mainText}</p>
          <Link to={readMoreLink} className={styles.readMore}>{readMoreLabel}</Link>
        </div>

        <div className={styles.center}>
          <div className={styles.circle} data-h-circle />
          <div className={styles.ring} data-h-ring />
          <img
            className={styles.portrait}
            data-h-portrait
            src={imageSrc}
            alt={imageAlt}
            width="923"
            height="924"
            fetchPriority="high"
          decoding="async"
          />
        </div>

        <div className={styles.right} data-h-display>
          <h1 className={styles.overlayText}>
            {overlayText.part1}
            <br />
            {overlayText.part2}
          </h1>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.socials} data-h-foot>
          {socialLinks.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              {label}
            </a>
          ))}
        </div>
        <div className={styles.location} data-h-foot>{locationText}</div>
      </footer>
    </div>
  );
}
