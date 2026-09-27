import styles from './Arcs.module.css';

/*
  Concentric semicircles anchored to the right edge of a panel.
  Used on the page-change screen and on each page's opening panel, so every
  page carries the same quiet, traditional texture.

  tone   'light' on navy, 'dark' on the light-blue pages
  side   'right' (default) or 'left'
*/
const RINGS = [
  { r: 130, dash: false, w: 1 },
  { r: 200, dash: true, w: 1 },
  { r: 270, dash: false, w: 1 },
  { r: 340, dash: true, w: 1 },
  { r: 395, dash: false, w: 1.4 },
];

export default function Arcs({ tone = 'dark', side = 'right', className = '' }) {
  return (
    <div className={`${styles.arcs} ${styles[tone]} ${styles[side]} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMaxYMid meet">
        {/* filled half-disc for depth */}
        <circle cx="400" cy="400" r="130" className={styles.fill} />
        {RINGS.map(({ r, dash, w }, index) => (
          <g key={r} className={dash ? styles.spin : undefined} style={{ animationDuration: `${60 + index * 18}s`, animationDirection: index % 2 ? 'reverse' : 'normal' }}>
            <circle
              cx="400"
              cy="400"
              r={r}
              className={index % 2 ? styles.gold : styles.line}
              strokeWidth={w}
              strokeDasharray={dash ? '2 7' : undefined}
            />
            {/* a small bead riding each dashed ring */}
            {dash && <circle cx={400 - r} cy="400" r="4" className={styles.bead} />}
          </g>
        ))}
      </svg>
    </div>
  );
}
