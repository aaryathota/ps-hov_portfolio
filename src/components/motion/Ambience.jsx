import { useEffect, useRef } from 'react';
import styles from './Ambience.module.css';

/*
  Two quiet touches borrowed from the Ember coffee site: a fine film grain
  over the whole page, and a soft light that follows the cursor. Both are
  decorative, pointer-events off, and skipped for reduced motion or touch.
*/
export default function Ambience() {
  const glow = useRef(null);

  useEffect(() => {
    const node = glow.current;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!node || !fine || reduce) return undefined;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const move = (event) => { tx = event.clientX; ty = event.clientY; };
    const loop = () => {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    node.dataset.on = 'true';

    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className={styles.grain} aria-hidden="true" />
      <div ref={glow} className={styles.glow} aria-hidden="true" />
    </>
  );
}
