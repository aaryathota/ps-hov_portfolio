import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Briefcase } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import Arcs from '@/components/ui/Arcs';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './page.module.css';
import { getSiteSettings } from '@/api';
import { defaultSiteSettings } from '@/data/siteContent';

function createAboutHeroScrollAnimation(gsap, ScrollTrigger, rootRef) {
  const root = rootRef.current;
  const content = root?.querySelector('[data-hero-content]');
  if (!root || !content) return;
  gsap.to(content, {
    y: -18,
    opacity: 0.9,
    ease: 'none',
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    },
  });
}

function createStoryAnimation(gsap, ScrollTrigger) {
  gsap.fromTo('[data-motion="story-paragraph"]',
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.18,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-trigger="prose"]', start: 'top 75%', once: true },
    },
  );
}

function createPrinciplesAnimation(gsap, ScrollTrigger) {
  gsap.fromTo('[data-motion="principle-number"]',
    { opacity: 0, x: -14 },
    {
      opacity: 1,
      x: 0,
      duration: 0.45,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-trigger="principles-list"]', start: 'top 78%', once: true },
    },
  );
}

function createPortfolioAnimation(gsap, ScrollTrigger) {
  gsap.fromTo('[data-motion="note-quote"]',
    { opacity: 0, y: 22 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.16,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-trigger="note-box"]', start: 'top 78%', once: true },
    },
  );
}

function createClosingTransition(gsap, ScrollTrigger, rootRef) {
  const root = rootRef.current;
  if (!root) return;
  gsap.fromTo(root.querySelector('[data-motion="transition-line"]'),
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: root, start: 'top 82%', once: true },
    },
  );
}

function SectionProgress() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });
  const prefersReducedMotion = useReducedMotion();

  return <motion.span ref={ref} className={styles.sectionProgress} aria-hidden="true"
    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scaleY: 0 }}
    animate={isInView ? (prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scaleY: 1 }) : {}}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />;
}

export default function AboutPage() {
  const [copy, setCopy] = useState(defaultSiteSettings.pages.about);
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const workRef = useRef(null);
  const portfolioRef = useRef(null);
  const noteRef = useRef(null);
  const ctaRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, amount: 0.3 });
  const workInView = useInView(workRef, { once: true, amount: 0.3 });
  const portfolioInView = useInView(portfolioRef, { once: true, amount: 0.3 });
  const noteInView = useInView(noteRef, { once: true, amount: 0.25 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  useEffect(() => { getSiteSettings().then((settings) => setCopy(settings.pages.about)); }, []);
  useGsap(heroRef, (gsapInstance, st) => createAboutHeroScrollAnimation(gsapInstance, st, heroRef));
  useGsap(storyRef, createStoryAnimation);
  useGsap(workRef, createPrinciplesAnimation);
  useGsap(noteRef, createPortfolioAnimation);
  useGsap(ctaRef, (gsapInstance, st) => createClosingTransition(gsapInstance, st, ctaRef));

  const fadeUp = (delay = 0) => ({
    initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 },
    transition: { delay, duration: 0.65, ease: 'easeOut' },
  });

  return <>
    <section ref={heroRef} className={`${styles.hero} grain`} data-trigger="hero">
      <Arcs className={styles.heroArcs} />
      <div className={`container ${styles.heroGrid}`}><div className={styles.heroContent} data-hero-content>
        <motion.div {...fadeUp(0.08)} animate={{ opacity: 1, y: 0 }}><SectionLabel>{copy.heroLabel}</SectionLabel></motion.div>
        <motion.h1 className={styles.heroTitle} {...fadeUp(0.18)} animate={{ opacity: 1, y: 0 }}>
          {copy.heroTitle.split(' ').map((word, index) => <span className={styles.heroWordMask} key={`${word}-${index}`}>
            <motion.span
              className={index === 2 ? `serif-accent ${styles.heroSerif}` : undefined}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: '110%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.2 + index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >{word}</motion.span>
          </span>)}
        </motion.h1>
        <motion.p className={styles.subheadline} {...fadeUp(0.33)} animate={{ opacity: 1, y: 0 }}>{copy.heroSubtitle}</motion.p>
      </div>
      <motion.figure
        className={styles.portrait}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={styles.portraitRing} aria-hidden="true" />
        <span className={styles.portraitDisc} aria-hidden="true" />
        <img src="/images/founder-about.webp" alt="Pratap Sonkar" width="542" height="440" decoding="async" fetchPriority="high" />
        <figcaption className={styles.portraitTag}>
          <span className={styles.portraitName}>Pratap Sonkar</span>
          <span className={styles.portraitRole}>Founder, P.Sonkar House Of Ventures</span>
        </figcaption>
      </motion.figure>
      </div>
    </section>

    <section className={`${styles.contentSection} section`} ref={storyRef}>
        <SectionProgress />
      <div className="container"><div className={styles.grid}>
        <motion.aside className={styles.sidebar} {...fadeUp(0)} animate={storyInView ? { opacity: 1, y: 0 } : {}}><SectionLabel>{copy.storyLabel}</SectionLabel><h2 className={styles.sidebarTitle}>{copy.storyTitle}</h2></motion.aside>
        <div className={styles.mainContent}><motion.div className={styles.prose} data-trigger="prose" {...fadeUp(0.28)} animate={storyInView ? { opacity: 1, y: 0 } : {}}>
          <p data-motion="story-paragraph">{copy.storyOne}</p>
          <p data-motion="story-paragraph">{copy.storyTwo}</p>
        </motion.div></div>
      </div></div>
    </section>

    <section className={`${styles.contentSection} section`} ref={workRef}>
      <SectionProgress />
      <div className="container"><div className={styles.grid}>
        <motion.aside className={styles.sidebar} {...fadeUp(0)} animate={workInView ? { opacity: 1, y: 0 } : {}}><SectionLabel>{copy.principlesLabel}</SectionLabel><h2 className={styles.sidebarTitle}>{copy.principlesTitle}</h2></motion.aside>
        <div className={styles.mainContent}><div className={styles.principlesList} data-trigger="principles-list">
          {[[copy.principleOneTitle, copy.principleOneText], [copy.principleTwoTitle, copy.principleTwoText], [copy.principleThreeTitle, copy.principleThreeText]].map(([title, body], index) => <motion.article className={styles.principle} key={title}
            initial={{ opacity: 1 }}
            animate={workInView ? { opacity: 1 } : { opacity: 0 }}>
            <motion.span
              className={styles.principleNumber}
              data-motion="principle-number"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -12 }}
              animate={workInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.45, ease: 'easeOut' }}
            >0{index + 1}</motion.span>
            <motion.h3
              className={styles.principleTitle}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
              animate={workInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.15, duration: 0.65, ease: 'easeOut' }}
            >{title}</motion.h3>
            <motion.p
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
              animate={workInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.28 + index * 0.15, duration: 0.65, ease: 'easeOut' }}
            >{body}</motion.p>
          </motion.article>)}
        </div></div>
      </div></div>
    </section>

    <section className={`${styles.contentSection} section`} ref={portfolioRef}>
      <SectionProgress />
      <div className="container"><div className={styles.grid}>
        <motion.aside className={styles.sidebar} {...fadeUp(0)} animate={portfolioInView ? { opacity: 1, y: 0 } : {}}><SectionLabel>Portfolio Intent</SectionLabel><h2 className={styles.sidebarTitle}>What Drives the Portfolio</h2></motion.aside>
        <div className={styles.mainContent}>
          <motion.div className={styles.prose} {...fadeUp(0.28)} animate={portfolioInView ? { opacity: 1, y: 0 } : {}}><p>Each venture in this ecosystem exists because there was a real gap worth addressing. The sectors vary but the reasoning is consistent: a problem that is large enough, a solution that is practical, and a model that can be made to work.</p></motion.div>
        </div>
      </div></div>
    </section>

    <section className={styles.ownWordsSection} ref={noteRef}>
      <div className="container">
        <motion.figure
          className={styles.noteBox}
          data-trigger="note-box"
          {...fadeUp(0.1)}
          animate={noteInView ? { opacity: 1, y: 0 } : {}}
        >
          <Arcs tone="light" className={styles.noteArcs} />
          <div className={styles.noteHead}>
            <span className={styles.noteIcon} aria-hidden="true">&ldquo;</span>
            <span className={styles.noteLabel}>In my own words</span>
          </div>
          <blockquote className={styles.noteBody}>
            <p className={styles.noteQuote} data-motion="note-quote">I did not set out to build a venture studio. I set out to work on things I believed needed to exist. This is what that looks like so far.</p>
            <p className={styles.noteQuoteSmall} data-motion="note-quote">Along the way, I also built a network of people, businesses, and collaborations that became just as much a part of this ecosystem as the ventures I own. The collaborated services side of this is not separate from what I do. It is a reflection of the relationships and partnerships I have built over time for responsible and quality work getting delivered.</p>
          </blockquote>
          <figcaption className={styles.noteSign}>
            <img src="/images/founder-about.webp" alt="" width="542" height="440" loading="lazy" decoding="async" />
            <span><strong>Pratap Sonkar</strong><span>Founder</span></span>
          </figcaption>
        </motion.figure>
      </div>
    </section>

    <section className={`${styles.closingCTA} section`} ref={ctaRef} data-trigger="closing-cta">
      <span className={styles.transitionLine} data-motion="transition-line" aria-hidden="true" />
      <div className="container"><div className={styles.closingContent}>
        <motion.h2 className="section-title" {...fadeUp(0)} animate={ctaInView ? { opacity: 1, y: 0 } : {}}>Curious about the ventures or <span className="serif-accent">want to connect?</span></motion.h2>
        <div className={styles.closingButtons}>
          <motion.div {...fadeUp(0.2)} animate={ctaInView ? { opacity: 1, y: 0 } : {}}><Button to="/ventures" variant="primary" icon={<Briefcase size={16} />}>View My Ventures</Button></motion.div>
          <motion.div {...fadeUp(0.28)} animate={ctaInView ? { opacity: 1, y: 0 } : {}}><Button to="/services" variant="outline" iconAfter={<ArrowUpRight size={16} />}>Explore Services</Button></motion.div>
          <motion.div {...fadeUp(0.36)} animate={ctaInView ? { opacity: 1, y: 0 } : {}}><Button to="/contact" variant="outline" icon={<ArrowRight size={16} />}>Get Involved</Button></motion.div>
        </div>
      </div></div>
    </section>
  </>;
}
