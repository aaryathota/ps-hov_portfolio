import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ServiceGraphic from '@/components/ui/ServiceGraphic';
import styles from './CircularGallery.module.css';

/*
  Circular 3D gallery, ported from the 21st.dev "circular-gallery" component
  (Tailwind + TypeScript) to JSX and CSS Modules, so it uses the site's own
  tokens and needs no Tailwind. Cards stand on a ring, scrolling turns the
  ring, and it drifts slowly on its own when idle.

  Beyond the original:
  - the ring chases the scroll with easing, so it glides instead of stepping
  - the card in front rises toward you, catches a light sweep, and a soft
    glare follows the mouse across it
  - the ring leans a little with the mouse, and casts a floor shadow
  - the ring spins in when the section first appears
  - a progress line, a counter and an "Up next" link that scrolls to the next card
  - scroll progress is measured inside this section, not the whole document
  - radius is worked out from card width and count, so cards never overlap
  - cards facing away are hidden and removed from tab order
  - motion is painted straight to the DOM instead of 60 React renders a second
  - drift pauses on hover and focus; everything calms down for reduced motion
*/

const TONES = ['navy', 'teal', 'gold'];
const TWO_DIGITS = (n) => String(n).padStart(2, '0');
const SMOOTHING_MS = 120; // how loosely the ring follows the scroll
const INTRO_DEGREES = 70; // how far the ring spins in from

export default function CircularGallery({
  items,
  label = 'Services',
  autoRotateSpeed = 1.2, // degrees per second while idle
  scrollPerItem = 38, // screen heights of scrolling per card
}) {
  const count = items.length;
  const [active, setActive] = useState(0);

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const viewportRef = useRef(null);
  const ringRef = useRef(null);
  const barRef = useRef(null);
  const cardRefs = useRef([]);
  const state = useRef({
    w: 0, radius: 0, ready: false,
    scrollRot: 0, drift: 0, cur: 0, progress: 0,
    tx: 0, ty: 0, px: 0, py: 0,
    paused: false, reduced: false, lastScroll: 0, shown: -1,
  });

  const paint = () => {
    const s = state.current;
    const ring = ringRef.current;
    if (!ring || !s.w) return;
    const rot = s.cur;
    const step = 360 / count;
    ring.style.transform =
      `translateZ(${-s.radius}px) rotateX(${s.py.toFixed(3)}deg) rotateY(${(-rot + s.px).toFixed(3)}deg)`;

    let nearest = 0;
    let best = 999;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const rel = ((((i * step - rot) % 360) + 540) % 360) - 180;
      const away = Math.abs(rel);
      // the card in front rises toward you
      const near = Math.max(0, 1 - away / 30);
      const lift = near * near * (3 - 2 * near) * s.w * 0.12;
      card.style.transform = `rotateY(${i * step}deg) translateZ(${s.radius + lift}px)`;
      card.style.opacity = Math.max(0, 1 - away / 105).toFixed(3);
      const off = away > 55;
      if (card.inert !== off) card.inert = off;
      const front = away < 5;
      if (card._front !== front) {
        card._front = front;
        const face = card.firstElementChild;
        if (face) { if (front) face.setAttribute('data-front', ''); else face.removeAttribute('data-front'); }
      }
      if (away < best) { best = away; nearest = i; }
    });

    s.nearest = nearest;
    if (s.shown !== nearest) { s.shown = nearest; setActive(nearest); }
    if (barRef.current) barRef.current.style.transform = `scaleX(${s.progress.toFixed(4)})`;
  };

  const readScroll = () => {
    const s = state.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const stuckAt = parseFloat(getComputedStyle(stage).top) || 0;
    const travel = section.offsetHeight - stage.offsetHeight;
    s.progress = travel > 0
      ? Math.min(1, Math.max(0, (stuckAt - section.getBoundingClientRect().top) / travel))
      : 0;
    // first card at the top of the scroll, last card at the bottom
    s.scrollRot = s.progress * (count - 1) * (360 / count);
  };

  // Size the cards and the ring to the room available
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const section = sectionRef.current;
    if (!viewport || !section) return undefined;

    const measure = () => {
      const s = state.current;
      const width = Math.min(viewport.clientWidth * 0.84, 340, viewport.clientHeight / 1.77);
      s.w = Math.max(150, width);
      const spread = 1.2;
      s.radius = Math.max(s.w * 1.1, (s.w * spread) / (2 * Math.tan(Math.PI / Math.max(count, 3))));
      section.style.setProperty('--cg-w', `${s.w}px`);
      readScroll();
      if (!s.ready) {
        s.ready = true;
        s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // the ring spins in from the side the first time
        s.cur = s.scrollRot - (s.reduced ? 0 : INTRO_DEGREES);
      }
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [count]);

  // Scroll sets the target; the loop below eases toward it
  useEffect(() => {
    const onScroll = () => {
      state.current.lastScroll = performance.now();
      readScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [count]);

  // One loop, only while the gallery is on screen
  useEffect(() => {
    const s = state.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    s.reduced = media.matches;
    const onMedia = () => { s.reduced = media.matches; };
    media.addEventListener('change', onMedia);

    let raf = 0;
    let last = 0;
    let running = false;

    const tick = (now) => {
      const dt = last ? Math.min(now - last, 64) : 0;
      last = now;
      if (!s.paused && !s.reduced && performance.now() - s.lastScroll > 150) {
        s.drift += (autoRotateSpeed * dt) / 1000;
      }
      const target = s.scrollRot + s.drift;
      if (s.reduced) {
        s.cur = target;
        s.px = 0; s.py = 0;
      } else {
        s.cur += (target - s.cur) * (1 - Math.exp(-dt / SMOOTHING_MS));
        const ease = 1 - Math.exp(-dt / 220);
        s.px += (s.tx - s.px) * ease;
        s.py += (s.ty - s.py) * ease;
      }
      paint();
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      media.removeEventListener('change', onMedia);
    };
  }, [autoRotateSpeed, count]);

  const hold = (value) => () => { state.current.paused = value; };

  const onPointerEnter = (event) => { if (event.pointerType === 'mouse') state.current.paused = true; };

  const onPointerLeave = (event) => {
    if (event.pointerType !== 'mouse') return;
    const s = state.current;
    s.paused = false;
    s.tx = 0;
    s.ty = 0;
  };

  // The ring leans toward the mouse, and a soft light follows it over the front card
  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    const s = state.current;
    const box = stageRef.current.getBoundingClientRect();
    s.tx = ((event.clientX - box.left) / box.width - 0.5) * 4;
    s.ty = -((event.clientY - box.top) / box.height - 0.5) * 3;
    const card = cardRefs.current[s.nearest];
    const face = card?.firstElementChild;
    if (!face) return;
    const rect = face.getBoundingClientRect();
    face.style.setProperty('--gx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    face.style.setProperty('--gy', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  // "Up next" scrolls so the next card turns to the front
  const goTo = (index) => {
    const s = state.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const stuckAt = parseFloat(getComputedStyle(stage).top) || 0;
    const travel = section.offsetHeight - stage.offsetHeight;
    const progress = count > 1 ? index / (count - 1) : 0;
    const top = section.getBoundingClientRect().top + window.scrollY - stuckAt + progress * travel;
    s.drift = 0;
    window.scrollTo({ top, behavior: s.reduced ? 'auto' : 'smooth' });
  };

  const next = (active + 1) % count;
  const nextTitle = items[next]?.title;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={{ '--cg-n': count, '--cg-scroll': `${scrollPerItem}svh`, '--cg-scroll-fallback': `${scrollPerItem}vh` }}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        ref={stageRef}
        className={styles.stage}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        onFocus={hold(true)}
        onBlur={hold(false)}
      >
        <div ref={viewportRef} className={styles.viewport}>
          <div className={styles.floor} aria-hidden="true" />
          <div ref={ringRef} className={styles.ring}>
            {items.map((item, index) => {
              const tone = TONES[index % TONES.length];
              const name = item.title || `Service ${index + 1}`;
              return (
                <div
                  key={item.id || index}
                  ref={(node) => { cardRefs.current[index] = node; }}
                  className={styles.card}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${name}, ${index + 1} of ${count}`}
                >
                  <article className={styles.face} data-tone={tone}>
                    <span className={styles.sheen} aria-hidden="true" />
                    {item.image ? (
                      <img className={styles.media} src={item.image} alt="" loading="lazy" decoding="async" draggable={false} />
                    ) : (
                      <div className={styles.panel} aria-hidden="true"><ServiceGraphic name={item.graphic} /></div>
                    )}
                    <span className={styles.number}>{TWO_DIGITS(index + 1)}</span>
                    {item.title && <h2 className={styles.title}>{item.title}</h2>}
                    {item.tagline && <p className={`${styles.tagline} serif-accent`}>{item.tagline}</p>}
                    {item.description && <p className={styles.text}>{item.description}</p>}
                    {item.action && (
                      <Link className={styles.action} to={item.action.href}>
                        <span>{item.action.label}</span>
                        <ArrowRight size="1.05em" aria-hidden="true" />
                      </Link>
                    )}
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.count} aria-hidden="true">
            <span className={styles.counter}>{TWO_DIGITS(active + 1)}</span>
            <span className={styles.total}>/ {TWO_DIGITS(count)}</span>
            <span className={styles.track}><span ref={barRef} className={styles.bar} /></span>
          </p>
          <button type="button" className={styles.next} onClick={() => goTo(next)} aria-label={`Next service${nextTitle ? `: ${nextTitle}` : ''}`}>
            <span className={styles.nextLabel}>Up next</span>
            <span key={next} className={styles.nextTitle}>{nextTitle || TWO_DIGITS(next + 1)}</span>
            <ArrowRight size="1em" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
