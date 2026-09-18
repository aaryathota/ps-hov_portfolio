import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './PageTransition.module.css';

const routeOrder = ['/', '/about', '/ventures', '/services', '/contact'];

function getDirection(previousPath, nextPath) {
  const previousIndex = routeOrder.indexOf(previousPath);
  const nextIndex = routeOrder.indexOf(nextPath);
  return nextIndex >= previousIndex ? 1 : -1;
}

const pageVariants = {
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: (direction) => ({
    opacity: 0,
    y: direction > 0 ? -24 : 24,
    scale: 0.985,
  }),
  enter: { opacity: 0, y: 24, scale: 0.985 },
};

export default function PageTransition({ renderPage }) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const activeLocationRef = useRef(location);
  const hasMountedRef = useRef(false);
  const timersRef = useRef([]);
  const [activeLocation, setActiveLocation] = useState(location);
  const [transition, setTransition] = useState(null);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return undefined;
    }

    if (location.key === activeLocationRef.current.key || transition) return undefined;

    const direction = getDirection(activeLocationRef.current.pathname, location.pathname);
    const coverDuration = prefersReducedMotion ? 220 : 850;
    const holdDuration = prefersReducedMotion ? 80 : 220;
    const revealDuration = prefersReducedMotion ? 220 : 850;
    setTransition({ path: location.pathname, direction, phase: 'covering' });

    const coverTimer = window.setTimeout(() => {
      window.scrollTo(0, 0);
      activeLocationRef.current = location;
      setActiveLocation(location);
      setTransition({ path: location.pathname, direction, phase: 'revealing' });
    }, coverDuration + holdDuration);

    const revealTimer = window.setTimeout(() => {
      setTransition(null);
    }, coverDuration + holdDuration + revealDuration);
    timersRef.current = [coverTimer, revealTimer];

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, [location, prefersReducedMotion]);

  const pageTransition = prefersReducedMotion
    ? { duration: 0.22, ease: 'easeInOut' }
    : { duration: 0.85, ease: [0.65, 0, 0.35, 1] };

  const pageState = transition?.phase === 'covering'
    ? 'exit'
    : transition?.phase === 'revealing'
      ? 'enter'
      : 'visible';

  return (
    <div className={styles.root}>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`${activeLocation.pathname}${activeLocation.search}${activeLocation.hash}`}
          className={styles.page}
          custom={transition?.direction || 1}
          variants={pageVariants}
          initial={transition?.phase === 'revealing' ? 'enter' : false}
          animate={pageState}
          transition={pageTransition}
        >
          {renderPage(activeLocation)}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {transition && (
          <motion.div
            key={transition.path}
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: transition.phase === 'covering' ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion
              ? { duration: 0.22, ease: 'easeInOut' }
              : { duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
            aria-hidden="true"
          >
            <motion.span
              className={styles.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.28, duration: prefersReducedMotion ? 0.16 : 0.4, ease: 'easeInOut' }}
            >
              {transition.path === '/' ? 'Home' : transition.path.slice(1).replace('-', ' ')}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
