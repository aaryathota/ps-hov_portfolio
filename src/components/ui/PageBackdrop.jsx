import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './PageBackdrop.module.css';

/*
  Full-bleed photographic backdrop for a page or a section, with a slow
  parallax drift and a scrim so text stays readable. Used instead of the
  old flat dark background.
*/
export default function PageBackdrop({ src, fallback, alt = '', tint, strength = 'page', fixed = false, className = '' }) {
  const root = useRef(null);
  const image = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(image.current, { yPercent: -7 }, {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { window.clearTimeout(refresh); ctx.revert(); };
  }, []);

  return (
    <div ref={root} className={`${styles.root} ${fixed ? styles.fixed : ''} ${className}`} aria-hidden="true">
      <img
        ref={image}
        className={styles.image}
        src={src || fallback}
        alt={alt}
        loading="lazy"
        onError={(event) => { if (fallback && !event.currentTarget.src.endsWith(fallback)) event.currentTarget.src = fallback; }}
      />
      {tint && <span className={styles.tint} style={{ background: tint }} />}
      <span className={strength === 'section' ? styles.scrimSection : styles.scrim} />
    </div>
  );
}
