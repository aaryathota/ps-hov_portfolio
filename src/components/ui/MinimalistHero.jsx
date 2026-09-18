import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '@/lib/gsap';
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
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context((self) => {
      const q = self.selector;
      if (reduce) {
        gsap.set([q('[data-h-top]'), q('[data-h-circle]'), q('[data-h-portrait]'), q('[data-h-copy]'), q('[data-h-display]'), q('[data-h-foot]')], { opacity: 1, clearProps: 'transform,clipPath' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(q('[data-h-top]'), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.1)
        // the circle opens first
        .fromTo(q('[data-h-circle]'), { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' }, 0.25)
        // then the portrait rolls up out of it
        .fromTo(q('[data-h-portrait]'),
          { opacity: 0, yPercent: 26, clipPath: 'inset(100% 0% 0% 0%)' },
          { opacity: 1, yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'power3.out' }, 0.8)
        // then the copy and the display text sitting behind the portrait
        .fromTo(q('[data-h-copy]'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 }, 1.55)
        .fromTo(q('[data-h-display]'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9 }, 1.75)
        .fromTo(q('[data-h-foot]'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 1.95);
    }, root);

    return () => ctx.revert();
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
          <img
            className={styles.portrait}
            data-h-portrait
            src={imageSrc}
            alt={imageAlt}
            width="923"
            height="924"
            fetchPriority="high"
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
