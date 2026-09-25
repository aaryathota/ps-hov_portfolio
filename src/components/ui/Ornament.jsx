/** A hairline, a small gold diamond, a hairline. Purely decorative. */
export default function Ornament({ center = false, light = false, className = '', ...rest }) {
  const classes = ['ornament', center && 'ornament--center', light && 'ornament--light', className].filter(Boolean).join(' ');
  return <div className={classes} aria-hidden="true" {...rest}><span /></div>;
}
