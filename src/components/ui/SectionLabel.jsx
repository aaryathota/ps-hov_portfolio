/**
 * Short label that tells the reader which part of the story a section is in.
 */
export default function SectionLabel({ children, className = '' }) {
  return <span className={`section-label ${className}`}>{children}</span>;
}
