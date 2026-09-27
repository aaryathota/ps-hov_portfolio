import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { markIntroDone } from '@/lib/intro';
import Arcs from '@/components/ui/Arcs';
import styles from './PageTransition.module.css';

const routeOrder = ['/', '/about', '/ventures', '/services', '/contact'];

const routeNames = {
  '/': 'Home',
  '/about': 'About',
  '/ventures': 'Ventures',
  '/services': 'Services',
  '/contact': 'Get Involved',
};

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

/*
  The same navy screen, PS logo and page name is shown:
    - on the very first load of the site (the intro), and
    - between pages.
  index.html paints an identical static copy (#boot-splash) before any
  JavaScript runs, so there is no white flash before the intro.
*/
export default function PageTransition({ renderPage }) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const activeLocationRef = useRef(location);
  const hasMountedRef = useRef(false);
  const timersRef = useRef([]);
  const [activeLocation, setActiveLocation] = useState(location);
  const [transition, setTransition] = useState(() => ({ path: location.pathname, direction: 1, phase: 'intro', intro: true }));

  // First load: hold the logo, then lift it
  useEffect(() => {
    document.getElementById('boot-splash')?.remove();
    const hold = prefersReducedMotion ? 350 : 1350;
    const lift = prefersReducedMotion ? 220 : 650;
    const liftTimer = window.setTimeout(() => {
      setTransition((current) => (current?.intro ? { ...current, phase: 'revealing' } : current));
      markIntroDone();
    }, hold);
    const endTimer = window.setTimeout(() => {
      setTransition((current) => (current?.intro ? null : current));
    }, hold + lift);
    return () => { window.clearTimeout(liftTimer); window.clearTimeout(endTimer); markIntroDone(); };
    // Runs once, on first load only
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return undefined;
    }

    if (location.key === activeLocationRef.current.key || (transition && !transition.intro)) return undefined;

    const direction = getDirection(activeLocationRef.current.pathname, location.pathname);
    const coverDuration = prefersReducedMotion ? 220 : 520;
    const holdDuration = prefersReducedMotion ? 80 : 260;
    const revealDuration = prefersReducedMotion ? 220 : 560;
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
    : { duration: 0.55, ease: [0.65, 0, 0.35, 1] };

  const pageState = transition?.phase === 'covering'
    ? 'exit'
    : transition?.phase === 'revealing' && !transition.intro
      ? 'enter'
      : 'visible';

  const isIntro = transition?.phase === 'intro';
  const shown = isIntro || transition?.phase === 'covering';

  return (
    <div className={styles.root}>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`${activeLocation.pathname}${activeLocation.search}${activeLocation.hash}`}
          className={styles.page}
          custom={transition?.direction || 1}
          variants={pageVariants}
          initial={transition?.phase === 'revealing' && !transition.intro ? 'enter' : false}
          animate={pageState}
          transition={pageTransition}
        >
          {renderPage(activeLocation)}
        </motion.div>
      </AnimatePresence>

      {createPortal(
      <AnimatePresence>
        {transition && (
          <motion.div
            key={transition.intro ? 'intro' : transition.path}
            className={styles.overlay}
            initial={isIntro ? false : { opacity: 0 }}
            animate={{ opacity: shown ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion
              ? { duration: 0.22, ease: 'easeInOut' }
              : { duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            aria-hidden="true"
          >
            <ScreenTexture />
            <motion.span
              className={styles.label}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.14, duration: prefersReducedMotion ? 0.16 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.markWrap}>
                <span className={styles.markRing} />
                <img className={styles.mark} src="/images/logomark-white.webp" alt="" width="400" height="378" />
              </span>
              <span className={styles.rule} />
              <span className={styles.name}>{routeNames[transition.path] || ''}</span>
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </div>
  );
}

/* Semicircles on the right, a smaller set on the left, grain and a thin gold frame */
function ScreenTexture() {
  return (
    <>
      <Arcs tone="light" className={styles.arcsRight} />
      <Arcs tone="light" side="left" className={styles.arcsLeft} />
      <span className={styles.frame} />
      <span className={styles.grain} />
    </>
  );
}
