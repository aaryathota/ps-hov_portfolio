import { useEffect, useRef } from 'react';
import styles from './ScrollProgress.module.css';

/*
  Hairline at the top of the window that fills as the page scrolls.
  Same idea as the 21st.dev "Scroll Progress" component (id 18717), written
  here without its Tailwind and Framer dependencies: one transform per frame,
  updated from the scroll listener, so it costs almost nothing.
*/
export default function ScrollProgress() {
  const bar = useRef(null);

  useEffect(() => {
    const node = bar.current;
    if (!node) return undefined;
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      node.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <span ref={bar} className={styles.bar} />
    </div>
  );
}
