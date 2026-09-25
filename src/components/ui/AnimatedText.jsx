import { Fragment, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * Heading whose words lift out of a soft blur when it scrolls into view.
 * Adapted from 21st.dev "Soft Blur In" (per character there; per word here,
 * so long headings wrap naturally and stay calm on a formal page).
 *
 * Wrap words in asterisks to set them in the serif italic accent:
 *   "Here is what I am *building.*"
 *
 * The words keep real spaces between them, and the element carries the plain
 * sentence as its label, so screen readers and search engines read it normally.
 */

const EASE = [0.22, 1, 0.36, 1];

function parse(text) {
  let italic = false;
  return text.split(' ').map((raw) => {
    let word = raw;
    const opens = word.startsWith('*');
    if (opens) { italic = true; word = word.slice(1); }
    const current = italic;
    const closes = word.endsWith('*');
    if (closes) { word = word.slice(0, -1); italic = false; }
    return { word, italic: current };
  });
}

export default function AnimatedText({
  text,
  className = '',
  as: Tag = 'h2',
  delay = 0,
  stagger = 0.06,
  centered = false,
  nowrap = false,
  immediate = false,
  id,
}) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const show = immediate || seen;
  const words = parse(text);
  const plain = words.map((w) => w.word).join(' ');

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      aria-label={plain}
      style={{ textAlign: centered ? 'center' : undefined, whiteSpace: nowrap ? 'nowrap' : undefined }}
    >
      {words.map(({ word, italic }, i) => (
        <Fragment key={i}>
          <motion.span
            aria-hidden="true"
            className={italic ? 'serif-accent' : undefined}
            style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
            initial={reduce ? false : { opacity: 0, y: '0.32em', filter: 'blur(10px)' }}
            animate={show || reduce ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
            transition={{ duration: 0.95, delay: delay + i * stagger, ease: EASE }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  );
}
