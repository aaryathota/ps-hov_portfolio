import { motion, useReducedMotion } from 'framer-motion';

const offsets = {
  up: { x: 0, y: 50 },
  right: { x: 50, y: 0 },
  left: { x: -50, y: 0 },
};

/** Reveals its content once when it enters the viewport. */
export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}) {
  const prefersReducedMotion = useReducedMotion();
  const offset = offsets[direction] ?? offsets.up;

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={prefersReducedMotion
        ? { delay, duration: 0.3, ease: 'easeOut' }
        : { delay, type: 'spring', stiffness: 120, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}
