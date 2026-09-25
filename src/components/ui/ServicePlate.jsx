/*
  Drawn covers for the service cards, used when a service has no uploaded image.
  Each one is a simple diagram of what the service does, in the site's palette:
  identity (overlapping marks), growth (rising bars), structure (ruled columns).
*/

const PLATES = {
  identity: {
    from: '#16406f', to: '#0f2440',
    art: (
      <g fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2">
        <circle cx="150" cy="150" r="78" />
        <circle cx="210" cy="150" r="78" />
        <circle cx="180" cy="98" r="78" />
        <circle cx="180" cy="98" r="6" fill="#e6c46b" stroke="none" />
        <path d="M60 268 H300" stroke="rgba(255,255,255,0.25)" />
      </g>
    ),
  },
  growth: {
    from: '#0f7a7e', to: '#0a4a4d',
    art: (
      <g>
        {[54, 92, 78, 130, 112, 170, 148, 214].map((h, i) => (
          <rect key={i} x={40 + i * 32} y={290 - h} width="20" height={h} fill="rgba(255,255,255,0.16)" />
        ))}
        <polyline fill="none" stroke="#e6c46b" strokeWidth="2" points="50,230 82,190 114,204 146,150 178,166 210,110 242,128 274,66" />
        <circle cx="274" cy="66" r="5" fill="#e6c46b" />
      </g>
    ),
  },
  structure: {
    from: '#a97c12', to: '#6b4c08',
    art: (
      <g fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2">
        <path d="M60 250 H300 M70 250 V120 M110 250 V120 M150 250 V120 M190 250 V120 M230 250 V120 M270 250 V120" />
        <path d="M50 120 H310 L180 56 Z" />
        <path d="M50 270 H310" stroke="rgba(255,255,255,0.22)" />
      </g>
    ),
  },
};

export default function ServicePlate({ variant = 'identity' }) {
  const plate = PLATES[variant] || PLATES.identity;
  const id = `plate-${variant}`;
  return (
    <svg viewBox="0 0 360 360" preserveAspectRatio="xMidYMid slice" role="presentation">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={plate.from} />
          <stop offset="1" stopColor={plate.to} />
        </linearGradient>
      </defs>
      <rect width="360" height="360" fill={`url(#${id})`} />
      {plate.art}
    </svg>
  );
}
