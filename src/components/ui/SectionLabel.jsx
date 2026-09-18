/**
 * Overline-style section label (e.g., "The Portfolio", "Ecosystem Partners").
 * Uppercase, tracked, accent-colored.
 */
export default function SectionLabel({ children, className = '' }) {
  return (
    <span className={`section-label ${className}`}>
      {children}
    </span>
  );
}
