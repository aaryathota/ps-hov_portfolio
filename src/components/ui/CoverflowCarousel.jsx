import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CoverflowCarousel.module.css';

/*
  Coverflow carousel, ported from the 21st.dev "coverflow-carousel" component
  (Tailwind + TypeScript) to JSX and CSS Modules. The motion maths, drag
  physics, looping and keyboard handling are unchanged.
*/

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = 'clamp(180px, 26vw, 330px)',
  gap = 0.05,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  label = 'Partner services',
  onSelect,
}) {
  const count = slides.length;

  const frameRef = useRef(null);
  const cardRefs = useRef([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const widthRef = useRef(0);
  const rafRef = useRef(null);
  const dragRef = useRef(null);

  const [selected, setSelected] = useState(0);

  const indexAt = useCallback((pos) => ((Math.round(pos) % count) + count) % count, [count]);

  // Paint straight to the DOM: sixty React renders a second would be wasteful
  const paint = useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }
      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = useCallback((target) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    targetRef.current = target;
    setSelected(indexAt(target));

    const step = () => {
      const remaining = target - posRef.current;
      if (Math.abs(remaining) < 0.0004) {
        posRef.current = target;
        paint();
        rafRef.current = null;
        return;
      }
      posRef.current += remaining * 0.16;
      paint();
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [indexAt, paint]);

  const clamp = useCallback((pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))), [count, loop]);

  const goTo = useCallback((index) => {
    const target = loop ? index + Math.round((targetRef.current - index) / count) * count : index;
    settle(clamp(target));
  }, [clamp, count, loop, settle]);

  const nudge = useCallback((by) => settle(clamp(Math.round(targetRef.current) + by)), [clamp, settle]);

  const onPointerDown = (event) => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = { id: event.pointerId, x: event.clientX, pos: posRef.current, v: 0, t: performance.now() };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;
    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;
    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  useEffect(() => () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); }, []);

  useEffect(() => { onSelect?.(selected); }, [selected, onSelect]);

  const active = slides[selected];

  return (
    <div className={styles.root} style={{ '--cf-card': cardWidth }} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className={styles.stage}>
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); nudge(-1); }
            else if (event.key === 'ArrowRight') { event.preventDefault(); nudge(1); }
          }}
          className={styles.frame}
          style={{ perspective: `calc(var(--cf-card) * ${perspective})` }}
        >
          <div className={styles.track}>
            {slides.map((slide, index) => (
              <div
                key={slide.title || index}
                ref={(node) => { cardRefs.current[index] = node; }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                className={styles.card}
                onClick={() => goTo(index)}
              >
                <img src={slide.src} alt={slide.alt} draggable={false} className={styles.image} loading="lazy" />
                <div className={styles.cardLabel}>
                  {slide.kind && <span className={styles.cardKind}>{slide.kind}</span>}
                  {slide.title && <span className={styles.cardTitle}>{slide.title}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button type="button" aria-label="Previous slide" onClick={() => nudge(-1)} className={`${styles.navButton} ${styles.navPrev}`}>
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next slide" onClick={() => nudge(1)} className={`${styles.navButton} ${styles.navNext}`}>
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div key={selected} className={styles.caption}>
          <p className={styles.captionTitle}>{active.title}</p>
          {active.subtitle && <p className={styles.captionSubtitle}>{active.subtitle}</p>}
          {active.meta?.length > 0 && (
            <dl className={styles.meta}>
              {active.meta.map((row) => (
                <div key={row.label} className={styles.metaRow}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {active.action && (
            <a className={styles.captionAction} href={active.action.href}>{active.action.label}</a>
          )}
        </div>
      )}

      {showPagination && (
        <div className={styles.dots}>
          {slides.map((slide, index) => (
            <button
              key={slide.title || index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={index === selected ? `${styles.dot} ${styles.dotActive}` : styles.dot}
            />
          ))}
        </div>
      )}
    </div>
  );
}
