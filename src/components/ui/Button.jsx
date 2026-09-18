import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import styles from './Button.module.css';

/**
 * Premium animated button with glow effects and hover states.
 * Supports primary (filled), secondary (glass), ghost, and outline variants.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  glowing = false,
  magnetic = false,
  className = '',
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 14 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 14 });

  const handleMouseMove = (event) => {
    if (!magnetic || prefersReducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
    mouseY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 12);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        fullWidth ? styles.fullWidth : ''
      } ${glowing ? styles.glowing : ''} ${className}`}
      style={magnetic && !prefersReducedMotion ? { x: springX, y: springY } : undefined}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
      <span className={styles.sweep} aria-hidden="true" />
    </motion.button>
  );
}
