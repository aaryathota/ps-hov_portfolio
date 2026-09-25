import { Link } from 'react-router-dom';
import Magnetic from '@/components/motion/Magnetic';
import styles from './Button.module.css';

/**
 * One button for the whole site.
 * Renders a router Link when `to` is set, an anchor when `href` is set, and a
 * real <button> otherwise, so links are never nested inside buttons.
 *
 * variants: primary, secondary, outline, ghost, onDark, onDarkOutline
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconAfter,
  magnetic = false,
  to,
  href,
  className = '',
  ...props
}) {
  const classes = [
    styles.button,
    styles[variant] || styles.primary,
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      <span className={styles.fill} aria-hidden="true" />
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
      {iconAfter && <span className={`${styles.icon} ${styles.iconAfter}`}>{iconAfter}</span>}
    </>
  );

  let node;
  if (to) node = <Link to={to} className={classes} {...props}>{content}</Link>;
  else if (href) node = <a href={href} className={classes} {...props}>{content}</a>;
  else node = <button className={classes} {...props}>{content}</button>;

  return magnetic ? <Magnetic>{node}</Magnetic> : node;
}
