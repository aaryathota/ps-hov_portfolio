import styles from './ServiceGraphic.module.css';

/*
  Line drawings for the service cards, in the site's palette (white line work
  with gold accents on the navy, teal or gold panel). One drawing per service.
  Every shape is fully drawn by default; the motion (draw-in, rise, pop, pulse)
  plays while the card is in front. See ServiceGraphic.module.css.
*/

const W = 'rgba(255,255,255,0.7)';
const SOFT = 'rgba(255,255,255,0.14)';
const FAINT = 'rgba(255,255,255,0.28)';
const GOLD = '#e6c46b';

// Props for a shape that draws itself in; `i` staggers it
const d = (i = 0) => ({ className: styles.draw, pathLength: 1, style: { '--i': i } });
const rise = (i = 0) => ({ className: styles.rise, style: { '--i': i } });
const pop = (i = 0) => ({ className: styles.pop, style: { '--i': i } });
const pulse = (i = 0) => ({ className: styles.pulse, style: { '--i': i } });
const ping = (i = 0) => ({ className: styles.ping, style: { '--i': i } });
const fade = (i = 0) => ({ className: styles.fade, style: { '--i': i } });

const sparkle = (x, y, s = 5) =>
  `M${x} ${y - s} L${x + s * 0.28} ${y - s * 0.28} L${x + s} ${y} L${x + s * 0.28} ${y + s * 0.28} L${x} ${y + s} L${x - s * 0.28} ${y + s * 0.28} L${x - s} ${y} L${x - s * 0.28} ${y - s * 0.28} Z`;

const ART = {
  /* Events: spotlights over a crowd, bunting overhead */
  events: () => {
    const crowd = Array.from({ length: 9 }, (_, i) => 48 + i * 25.5);
    const flags = [0.1, 0.23, 0.36, 0.5, 0.64, 0.77, 0.9].map((t) => [300 * t, 8 + 44 * t * (1 - t)]);
    return (
      <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="none" fill={SOFT}>
          <path {...fade(0)} d="M90 0 L52 76 L128 76 Z" />
          <path {...fade(1)} d="M150 0 L112 76 L188 76 Z" />
          <path {...fade(2)} d="M210 0 L172 76 L248 76 Z" />
        </g>
        <path {...d(0)} d="M0 8 Q150 30 300 8" stroke={FAINT} />
        {flags.map(([x, y], i) => (
          <path key={i} {...pop(i)} d={`M${x - 5} ${y} L${x + 5} ${y} L${x} ${y + 9} Z`} fill={i % 2 ? GOLD : SOFT} stroke="none" />
        ))}
        <path {...d(1)} d="M24 92 H276" stroke={FAINT} />
        {crowd.map((x, i) => (
          <g key={x}>
            <circle {...d(i)} cx={x} cy={68 - (i % 2) * 3} r="4.6" />
            <path {...d(i)} d={`M${x - 9} 91 Q${x} ${73 - (i % 2) * 3} ${x + 9} 91`} />
          </g>
        ))}
        <path {...pulse(0)} d={sparkle(62, 38)} fill={GOLD} stroke="none" />
        <path {...pulse(1)} d={sparkle(238, 34, 6)} fill={GOLD} stroke="none" />
        <path {...pulse(2)} d={sparkle(150, 44, 4)} fill={GOLD} stroke="none" />
      </g>
    );
  },

  /* US immigration: globe, flight path, passport with a visa stamp */
  visa: () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle {...d(0)} cx="92" cy="52" r="34" />
      <ellipse {...d(1)} cx="92" cy="52" rx="15" ry="34" />
      <path {...d(2)} d="M58 52 H126 M64 36 Q92 42 120 36 M64 68 Q92 62 120 68" />
      <path {...fade(3)} d="M124 30 Q186 -8 238 34" stroke={GOLD} strokeDasharray="3 4" />
      <path {...pop(4)} d="M232 38 L262 26 L246 52 L242 43 Z" fill={GOLD} stroke="none" />
      <g className={styles.float}>
        <rect {...d(2)} x="196" y="50" width="46" height="38" rx="4" fill={SOFT} />
        <circle {...d(3)} cx="219" cy="64" r="7" />
        <path {...d(3)} d="M206 77 H232 M209 82 H229" />
      </g>
      <g {...pop(5)}>
        <circle cx="240" cy="82" r="9" fill="#0f2440" stroke={GOLD} />
        <path d="M235.5 82 l3 3 l6 -6" stroke={GOLD} />
      </g>
    </g>
  ),

  /* Real estate and BBMP: a house between two buildings, approval badge */
  'real-estate': () => {
    const windows = (x, y, cols, rows, gap = 11) => Array.from({ length: cols * rows }, (_, k) => (
      <rect key={`${x}-${k}`} x={x + (k % cols) * gap} y={y + Math.floor(k / cols) * gap} width="5" height="6" fill={FAINT} stroke="none" />
    ));
    return (
      <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path {...d(0)} d="M18 90 H282" stroke={FAINT} />
        <g {...rise(0)}>
          <rect {...d(1)} x="58" y="40" width="36" height="50" fill={SOFT} />
          {windows(65, 48, 2, 3)}
        </g>
        <g {...rise(1)}>
          <rect {...d(1)} x="206" y="30" width="42" height="60" fill={SOFT} />
          {windows(213, 38, 3, 4, 10)}
        </g>
        <path {...d(2)} d="M110 54 L150 24 L190 54" />
        <rect {...d(3)} x="118" y="54" width="64" height="36" fill={SOFT} />
        <rect {...d(4)} x="142" y="66" width="16" height="24" />
        <rect {...d(4)} x="125" y="60" width="11" height="11" />
        <rect {...d(4)} x="164" y="60" width="11" height="11" />
        <g {...pop(5)}>
          <circle cx="266" cy="22" r="10" fill="#0f2440" stroke={GOLD} />
          <path d="M261 22 l3.5 3.5 l6.5 -7" stroke={GOLD} />
        </g>
      </g>
    );
  },

  /* Turnkey projects: a key on a blueprint grid, handover tick */
  turnkey: () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <g stroke="rgba(255,255,255,0.1)" strokeWidth="1">
        {[26, 52, 78, 104, 130, 156, 182, 208, 234, 260, 286].map((x) => <path key={x} d={`M${x} 0 V100`} />)}
        {[20, 40, 60, 80].map((y) => <path key={y} d={`M0 ${y} H300`} />)}
      </g>
      <g className={styles.float}>
        <circle {...d(0)} cx="100" cy="50" r="19" fill={SOFT} />
        <circle {...d(1)} cx="100" cy="50" r="7" stroke={GOLD} />
        <path {...d(2)} d="M119 50 H212" />
        <path {...d(3)} d="M190 50 V68 M201 50 V61 M212 50 V72" />
      </g>
      <g {...pop(5)}>
        <circle cx="254" cy="50" r="15" fill="#0f2440" stroke={GOLD} />
        <path d="M246 50 l6 6 l11 -12" stroke={GOLD} strokeWidth="1.8" />
      </g>
    </g>
  ),

  /* SaaS: a browser window with a rising chart */
  saas: () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect {...d(0)} x="58" y="10" width="184" height="80" rx="6" fill={SOFT} />
      <path {...d(1)} d="M58 26 H242" />
      <circle cx="69" cy="18" r="2" fill={GOLD} stroke="none" />
      <circle cx="78" cy="18" r="2" fill={W} stroke="none" />
      <circle cx="87" cy="18" r="2" fill={W} stroke="none" />
      <path {...d(2)} d="M70 38 H100 M70 48 H94 M70 58 H104 M70 68 H90" stroke={FAINT} />
      {[18, 28, 22, 38, 48].map((h, i) => (
        <rect key={i} {...rise(i)} x={122 + i * 20} y={82 - h} width="11" height={h} fill={FAINT} stroke="none" />
      ))}
      <polyline {...d(4)} points="127,66 147,56 167,60 187,46 207,36" stroke={GOLD} strokeWidth="2" />
      <path {...pop(6)} d="M226 60 L226 78 L231 73 L235 82 L239 80 L235 71 L242 71 Z" fill={GOLD} stroke="none" />
    </g>
  ),

  /* AI tools: a small neural network feeding one answer */
  ai: () => {
    const layers = [
      { x: 56, ys: [22, 50, 78] },
      { x: 124, ys: [14, 38, 62, 86] },
      { x: 192, ys: [30, 70] },
    ];
    const out = { x: 250, y: 50 };
    const edges = [];
    layers.forEach((layer, li) => {
      const nextPoints = li < layers.length - 1 ? layers[li + 1].ys.map((y) => ({ x: layers[li + 1].x, y })) : [out];
      layer.ys.forEach((y) => nextPoints.forEach((n) => edges.push([layer.x, y, n.x, n.y])));
    });
    return (
      <g fill="none" stroke={W} strokeWidth="1.2" strokeLinecap="round">
        <g stroke={FAINT} strokeWidth="0.9">
          {edges.map(([x1, y1, x2, y2], i) => <path key={i} {...d(i % 6)} d={`M${x1} ${y1} L${x2} ${y2}`} />)}
        </g>
        {layers.map((layer) => layer.ys.map((y) => (
          <circle key={`${layer.x}-${y}`} {...pop(layer.x / 60)} cx={layer.x} cy={y} r="5" fill="#0f2440" />
        )))}
        <circle {...ping(0)} cx={out.x} cy={out.y} r="12" stroke={GOLD} />
        <circle {...pop(5)} cx={out.x} cy={out.y} r="8" fill={GOLD} stroke="none" />
        <path {...pulse(1)} d={sparkle(278, 18, 5)} fill={GOLD} stroke="none" />
      </g>
    );
  },

  /* 360 marketing: four touchpoints orbiting one brand */
  'marketing-360': () => (
    <g fill="none" stroke={W} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <ellipse {...d(0)} cx="150" cy="50" rx="88" ry="38" stroke={FAINT} />
      <circle {...d(1)} cx="150" cy="50" r="26" stroke={FAINT} />
      <circle {...ping(0)} cx="150" cy="50" r="12" stroke={GOLD} />
      <circle {...pop(2)} cx="150" cy="50" r="7" fill={GOLD} stroke="none" />
      {/* search */}
      <g {...pop(3)}>
        <circle cx="62" cy="50" r="11" fill="#0f2440" />
        <circle cx="61" cy="49" r="3.2" /><path d="M63.5 51.5 L67 55" />
      </g>
      {/* social */}
      <g {...pop(4)}>
        <circle cx="150" cy="12" r="11" fill="#0f2440" />
        <path d="M150 17 l-5 -4.6 a2.6 2.6 0 0 1 5 -3.2 a2.6 2.6 0 0 1 5 3.2 Z" fill={GOLD} stroke="none" />
      </g>
      {/* street */}
      <g {...pop(5)}>
        <circle cx="238" cy="50" r="11" fill="#0f2440" />
        <path d="M238 57 l-4.5 -7.5 a4.5 4.5 0 1 1 9 0 Z" /><circle cx="238" cy="49.5" r="1.4" fill={W} stroke="none" />
      </g>
      {/* screen */}
      <g {...pop(6)}>
        <circle cx="150" cy="88" r="11" fill="#0f2440" />
        <rect x="144" y="83" width="12" height="8" rx="1" /><path d="M150 91 v2.4 M146.5 93.6 h7" />
      </g>
    </g>
  ),

  /* Apparel: a shirt being stitched, thread to a spool */
  apparel: () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path {...d(0)} fill={SOFT} d="M120 16 L138 10 Q150 22 162 10 L180 16 L198 38 L182 46 L176 40 L176 90 L124 90 L124 40 L118 46 L102 38 Z" />
      <path {...fade(2)} d="M130 82 H170 M130 46 V82 M170 46 V82" stroke={GOLD} strokeDasharray="3 3.5" strokeWidth="1.2" />
      <path {...d(3)} d="M176 62 C200 38 214 86 234 60" stroke={GOLD} />
      <g {...pop(4)}>
        <rect x="230" y="50" width="22" height="28" rx="3" fill={SOFT} />
        <path d="M230 57 H252 M230 71 H252" />
      </g>
      <g className={styles.float}>
        <path {...d(2)} d="M62 22 L98 60" />
        <circle cx="63" cy="23" r="2.2" stroke={GOLD} />
      </g>
    </g>
  ),

  /* Corporate travel: route between two pins, plane over the top */
  travel: () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path {...fade(0)} d="M200 20 h26 M208 27 h18 M64 30 h24 M72 37 h14" stroke={FAINT} />
      <path {...fade(1)} d="M62 78 Q150 -22 238 78" stroke={GOLD} strokeDasharray="3 4" />
      <g className={styles.float}>
        <path {...pop(3)} d="M136 32 L168 20 L156 42 L152 33 Z" fill={GOLD} stroke="none" />
      </g>
      <g {...pop(1)}>
        <path d="M62 88 l-6 -10 a6 6 0 1 1 12 0 Z" fill={SOFT} />
        <circle cx="62" cy="77" r="1.8" fill={W} stroke="none" />
      </g>
      <g {...pop(2)}>
        <path d="M238 88 l-6 -10 a6 6 0 1 1 12 0 Z" fill={GOLD} stroke="none" />
        <circle cx="238" cy="77" r="1.8" fill="#0f2440" stroke="none" />
      </g>
      <path {...d(0)} d="M40 92 H260" stroke={FAINT} />
    </g>
  ),

  /* Pre-owned MacBooks: a laptop with a certified badge */
  macbook: () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect {...d(0)} x="88" y="12" width="124" height="64" rx="5" fill={SOFT} />
      <rect {...d(1)} x="95" y="19" width="110" height="50" rx="2" stroke={FAINT} />
      <path {...d(2)} d="M68 80 H232 L224 90 H76 Z" fill={SOFT} />
      <path {...d(3)} d="M134 83 H166" stroke={FAINT} />
      <path {...fade(2)} d="M103 29 H124 M103 37 H116 M176 29 H197 M184 37 H197" stroke={FAINT} />
      <circle {...ping(0)} cx="150" cy="44" r="15" stroke={GOLD} />
      <g {...pop(4)}>
        <circle cx="150" cy="44" r="14" fill="#0f2440" stroke={GOLD} />
        <path d="M142.5 44 l5.5 5.5 l10 -11" stroke={GOLD} strokeWidth="2" />
      </g>
    </g>
  ),

  /* Cartridge refilling: a cartridge, a drop of ink, a refill cycle */
  cartridge: () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect {...d(0)} x="118" y="36" width="64" height="44" rx="5" fill={SOFT} />
      <rect {...d(1)} x="130" y="28" width="40" height="8" rx="2" />
      <path {...d(2)} d="M128 50 H172 M128 59 H160 M128 68 H150" stroke={FAINT} />
      <path className={styles.fall} d="M150 6 C150 6 143 15 143 19 a7 7 0 0 0 14 0 C157 15 150 6 150 6 Z" fill={GOLD} stroke="none" />
      <g stroke={GOLD}>
        <path {...d(3)} d="M104 30 A34 34 0 0 0 104 80" />
        <path {...pop(5)} d="M99 80 L108 84 L108 75 Z" fill={GOLD} stroke="none" />
        <path {...d(3)} d="M196 80 A34 34 0 0 0 196 30" />
        <path {...pop(5)} d="M201 30 L192 26 L192 35 Z" fill={GOLD} stroke="none" />
      </g>
    </g>
  ),

  /* Brand identity: overlapping marks, a pen curve and a swatch strip */
  'brand-identity': () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle {...d(0)} cx="132" cy="56" r="26" />
      <circle {...d(1)} cx="168" cy="56" r="26" />
      <circle {...d(2)} cx="150" cy="34" r="26" />
      <circle {...pulse(0)} cx="150" cy="34" r="4" fill={GOLD} stroke="none" />
      <path {...d(3)} d="M30 80 C46 20 74 20 90 74" stroke={GOLD} />
      {[[30, 80], [90, 74]].map(([x, y]) => <rect key={x} {...pop(3)} x={x - 3} y={y - 3} width="6" height="6" fill="#0f2440" />)}
      <rect {...pop(4)} x="228" y="18" width="20" height="20" rx="4" fill={GOLD} stroke="none" />
      <rect {...pop(5)} x="228" y="42" width="20" height="20" rx="4" fill="rgba(255,255,255,0.55)" stroke="none" />
      <rect {...pop(6)} x="228" y="66" width="20" height="20" rx="4" fill="#14b8a6" stroke="none" />
    </g>
  ),

  /* Digital marketing: bars rising with a growth line */
  'digital-marketing': () => {
    const heights = [16, 28, 22, 40, 34, 54, 48, 68];
    return (
      <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path {...d(0)} d="M50 92 H250" stroke={FAINT} />
        {heights.map((h, i) => (
          <rect key={i} {...rise(i)} x={58 + i * 24} y={92 - h} width="14" height={h} fill={FAINT} stroke="none" />
        ))}
        <polyline {...d(3)} stroke={GOLD} strokeWidth="2" points={heights.map((h, i) => `${65 + i * 24},${82 - h}`).join(' ')} />
        <circle {...ping(0)} cx="233" cy="14" r="7" stroke={GOLD} />
        <circle {...pop(8)} cx="233" cy="14" r="4.5" fill={GOLD} stroke="none" />
      </g>
    );
  },

  /* Legal and compliance: a columned hall with a signed document */
  'legal-compliance': () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path {...d(0)} d="M62 34 L112 10 L162 34 Z" fill={SOFT} />
      <circle {...pulse(0)} cx="112" cy="27" r="3.5" fill={GOLD} stroke="none" />
      {[72, 88, 104, 120, 136, 152].map((x, i) => <path key={x} {...d(i)} d={`M${x} 40 V78`} />)}
      <path {...d(2)} d="M56 82 H168 M52 90 H172" />
      <g className={styles.float}>
        <rect {...d(3)} x="206" y="26" width="42" height="54" rx="4" fill={SOFT} />
        <path {...d(4)} d="M215 40 H239 M215 49 H239 M215 58 H230" stroke={FAINT} />
      </g>
      <g {...pop(5)}>
        <circle cx="244" cy="74" r="10" fill="#0f2440" stroke={GOLD} />
        <path d="M239 74 l3.5 3.5 l7 -7.5" stroke={GOLD} />
      </g>
    </g>
  ),

  /* Fallback for services added later in the admin panel */
  generic: () => (
    <g fill="none" stroke={W} strokeWidth="1.4" strokeLinecap="round">
      <circle {...d(0)} cx="150" cy="50" r="14" stroke={FAINT} />
      <circle {...d(1)} cx="150" cy="50" r="28" stroke={FAINT} />
      <circle {...d(2)} cx="150" cy="50" r="42" stroke={FAINT} />
      <circle {...pulse(0)} cx="150" cy="50" r="5" fill={GOLD} stroke="none" />
    </g>
  ),
};

export default function ServiceGraphic({ name }) {
  const draw = ART[name] || ART.generic;
  return (
    <svg className={styles.art} viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true" focusable="false">
      {draw()}
    </svg>
  );
}
