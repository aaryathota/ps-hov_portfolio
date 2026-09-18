import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './ScrollLockedImageHero.module.css';

export default function ScrollLockedImageHero({
  eyebrow = 'Ideas in Motion. Ventures in Progress.',
  title = 'P.Sonkar House Of Ventures',
  tagline = 'A founder-led ecosystem built around the ventures I build, the people I work with, and the opportunities I create. Based in Bangalore.',
  ctas = [
    { label: 'Explore Ventures', href: '#ventures' },
    { label: 'Explore Services', href: '#services' },
    { label: 'Get Involved', href: '/contact' },
  ],
  portraitSrc = '/images/founder_cutout.webp',
  portraitAlt = 'Pratap Sonkar',
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.35 });
  const words = title.split(' ');
  const reduceMotion = useReducedMotion();

  // As the hero scrolls away the portrait drifts up and sinks back into the mist,
  // while a band of fog in front of it thins out
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.25]);
  const mistY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  return (
    <section ref={sectionRef} className={styles.hero} aria-label="P.Sonkar House of Ventures introduction">
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.scrim} aria-hidden="true" />

      {portraitSrc && (
        <motion.div
          className={styles.portrait}
          style={reduceMotion ? undefined : { y: portraitY, opacity: portraitOpacity }}
        >
          <motion.img
            src={portraitSrc}
            alt={portraitAlt}
            width="1016"
            height="1197"
            fetchPriority="high"
            decoding="async"
            className={styles.portraitImg}
            initial={reduceMotion ? false : { opacity: 0, filter: 'blur(14px)', scale: 1.05 }}
            animate={isInView ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : {}}
            transition={{ duration: 1.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Fog drifting across his lower half, so he stands inside the scene */}
          <motion.div
            className={styles.portraitMist}
            aria-hidden="true"
            style={reduceMotion ? undefined : { opacity: mistOpacity, y: mistY }}
          />
        </motion.div>
      )}

      <div className={styles.heroContent}>
        <div className={styles.wordmarkWrap}>
          <motion.p
            className={styles.eyebrow}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >{eyebrow}</motion.p>
          <h1 className={styles.title} aria-label={title}>
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.08 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
                {/* trailing space keeps the heading readable as plain text for search engines */}
                {index < words.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.div
          className={styles.heroAside}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p>{tagline}</p>
          <div className={styles.ctaGroup}>
            {ctas.map((cta) => {
              const content = (
                <>
                  {cta.label}
                  <span className={styles.ctaIcon}><ArrowRight size={17} aria-hidden="true" /></span>
                </>
              );
              // Route links use the router (no full reload); #hash links scroll on this page
              return cta.href.startsWith('/') ? (
                <Link key={cta.label} to={cta.href} className={styles.cta}>{content}</Link>
              ) : (
                <a key={cta.label} href={cta.href} className={styles.cta}>{content}</a>
              );
            })}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
