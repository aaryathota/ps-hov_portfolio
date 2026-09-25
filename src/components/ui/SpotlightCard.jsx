import { useRef } from 'react';
import styles from './SpotlightCard.module.css';

/**
 * A panel with a soft light that follows the pointer, plus a hairline border
 * that brightens under it. Adapted from 21st.dev "Spotlight Card": the pointer
 * position is written to CSS variables instead of React state, so moving the
 * mouse never re-renders the card. Keyboard focus inside lights the whole card.
 */
export default function SpotlightCard({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);

  const move = (event) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${event.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${event.clientY - r.top}px`);
  };

  return (
    <Tag ref={ref} className={`${styles.card} ${className}`} onPointerMove={move} {...rest}>
      <span className={styles.light} aria-hidden="true" />
      <span className={styles.edge} aria-hidden="true" />
      {children}
    </Tag>
  );
}
