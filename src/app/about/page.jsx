import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Compass, Network, ScanLine } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import PageBackdrop from '@/components/ui/PageBackdrop';
import { pageMedia } from '@/data/media';
import styles from './page.module.css';

const principles = [
  ['Start With Clarity', 'Every venture I work on begins with a clear understanding of the problem being solved, who it is being solved for, and whether there is a sustainable model behind it. Clarity before action, always.', Compass],
  ['Stay Close to the Work', 'I stay operationally close to what I build. Not from a distance. I am inside the decisions, the conversations, and the details that actually determine whether something works or not.', ScanLine],
  ['Build Systems, Not Dependencies', 'The goal is always to build something that does not depend entirely on me. Systems and teams are built alongside what we are building, not after it.', Network],
];

function createAboutHeroScrollAnimation(gsap, ScrollTrigger) {
  gsap.fromTo('[data-about-portrait]',
    { opacity: 0, y: 32, scale: 0.97 },
    { opacity: 0.92, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' },
  );

  gsap.to('[data-about-hero-content]', {
    y: -18,
    opacity: 0.9,
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-about-hero-content]',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    },
  });

  gsap.to('[data-about-portrait]', {
    yPercent: 5,
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-about-hero-content]',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
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
      scrollTrigger: { trigger: '[data-about-story]', start: 'top 75%', once: true },
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
      scrollTrigger: { trigger: '[data-about-principles]', start: 'top 78%', once: true },
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
      scrollTrigger: { trigger: '[data-about-note]', start: 'top 78%', once: true },
    },
  );
}

function createClosingTransition(gsap, ScrollTrigger) {
  gsap.fromTo('[data-motion="transition-line"]',
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-motion="transition-line"]', start: 'top 82%', once: true },
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
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const workRef = useRef(null);
  const portfolioRef = useRef(null);
  const ctaRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, amount: 0.3 });
  const workInView = useInView(workRef, { once: true, amount: 0.3 });
  const portfolioInView = useInView(portfolioRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  useGsap(heroRef, createAboutHeroScrollAnimation);
  useGsap(storyRef, createStoryAnimation);
  useGsap(workRef, createPrinciplesAnimation);
  useGsap(portfolioRef, createPortfolioAnimation);
  useGsap(ctaRef, createClosingTransition);

  const fadeUp = (delay = 0) => ({
    initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 },
    transition: { delay, duration: 0.65, ease: 'easeOut' },
  });

  return <>
    <PageBackdrop fixed src={pageMedia.about.src} fallback={pageMedia.about.fallback} />
    <section ref={heroRef} className={styles.hero} data-about-hero>
      <img className={styles.heroPortrait} data-about-portrait src="/images/founder_polo.webp" alt="Pratap Sonkar" width="661" height="585"
          decoding="async" />
      <div className="container"><div className={styles.heroContent} data-about-hero-content>
        <motion.div {...fadeUp(0.08)} animate={{ opacity: 1, y: 0 }}><SectionLabel>About Pratap Sonkar</SectionLabel></motion.div>
        <motion.h1 className={styles.heroTitle} {...fadeUp(0.18)} animate={{ opacity: 1, y: 0 }}>
          {['Builder.', 'Operator.', 'Founder.'].map((word, index) => <span className={styles.heroWordMask} key={word}>
            {index > 0 ? ' ' : null}
            <motion.span
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: '110%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.2 + index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >{word}</motion.span>
          </span>)}
        </motion.h1>
        <motion.p className={styles.subheadline} {...fadeUp(0.33)} animate={{ opacity: 1, y: 0 }}>Here is my story and what I am building.</motion.p>
      </div></div>
    </section>

    <section data-reveal className={`${styles.contentSection} section`} ref={storyRef}>
      <SectionProgress />
      <div className="container"><div className={styles.grid}>
        <motion.aside className={styles.sidebar} {...fadeUp(0)} animate={storyInView ? { opacity: 1, y: 0 } : {}}><SectionLabel>My Story</SectionLabel><h2 className={styles.sidebarTitle}>The Story</h2></motion.aside>
        <div className={styles.mainContent}><motion.div className={styles.prose} data-about-story {...fadeUp(0.28)} animate={storyInView ? { opacity: 1, y: 0 } : {}}>
          <p data-motion="story-paragraph">P.Sonkar House Of Ventures did not come together through a single plan. It came together through years of working on things I genuinely believed needed to exist, starting from scratch, figuring things out on the ground, and building across areas I found myself drawn to.</p>
          <p data-motion="story-paragraph">Over time, what started as individual projects began to take shape as a connected ecosystem. P.Sonkar House Of Ventures is the formal structure that holds all of it together. It is the parent entity behind every venture I build and every collaboration I am part of.</p>
        </motion.div></div>
      </div></div>
    </section>

    <section data-reveal className={`${styles.contentSection} section`} ref={workRef}>
      <SectionProgress />
      <div className="container"><div className={styles.grid}>
        <motion.aside className={styles.sidebar} {...fadeUp(0)} animate={workInView ? { opacity: 1, y: 0 } : {}}><SectionLabel>Working Principles</SectionLabel><h2 className={styles.sidebarTitle}>How I Work</h2></motion.aside>
        <div className={styles.mainContent}><div className={styles.principlesList} data-about-principles>
          {principles.map(([title, body, Icon], index) => <motion.article className={styles.principle} key={title}
            initial={{ opacity: 1 }}
            animate={workInView ? { opacity: 1 } : { opacity: 0 }}>
            <motion.span
              className={styles.principleNumber}
              data-motion="principle-number"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -12 }}
              animate={workInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.45, ease: 'easeOut' }}
            >0{index + 1}</motion.span>
            <Icon className={styles.principleIcon} size={22} strokeWidth={1.6} aria-hidden="true" />
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

    <section data-reveal className={`${styles.contentSection} section`} ref={portfolioRef}>
      <SectionProgress />
      <div className="container"><div className={styles.grid}>
        <motion.aside className={styles.sidebar} {...fadeUp(0)} animate={portfolioInView ? { opacity: 1, y: 0 } : {}}><SectionLabel>Portfolio Intent</SectionLabel><h2 className={styles.sidebarTitle}>What Drives the Portfolio</h2></motion.aside>
        <div className={styles.mainContent}>
          <motion.div className={styles.prose} {...fadeUp(0.28)} animate={portfolioInView ? { opacity: 1, y: 0 } : {}}><p>Each venture in this ecosystem exists because there was a real gap worth addressing. The sectors vary but the reasoning is consistent: a problem that is large enough, a solution that is practical, and a model that can be made to work.</p></motion.div>
          <section className={styles.ownWords}>
            <motion.div {...fadeUp(0.48)} animate={portfolioInView ? { opacity: 1, y: 0 } : {}}><SectionLabel>In My Own Words</SectionLabel></motion.div>
            <motion.div
              className={styles.noteBox}
              data-about-note
              {...fadeUp(0.76)}
              animate={portfolioInView ? { opacity: 1, y: 0 } : {}}
            >
              <p className={styles.noteQuote} data-motion="note-quote">&quot;I did not set out to build a venture studio. I set out to work on things I believed needed to exist. This is what that looks like so far.</p>
              <p className={styles.noteQuote} data-motion="note-quote">Along the way, I also built a network of people, businesses, and collaborations that became just as much a part of this ecosystem as the ventures I own. The Collaborated Services side of this is not separate from what I do. It is a reflection of the relationships and partnerships I have built over time for responsible and quality work getting delivered.&quot;</p>
            </motion.div>
          </section>
        </div>
      </div></div>
    </section>

    <section className={`${styles.closingCTA} section`} ref={ctaRef} data-about-closing>
      <span className={styles.transitionLine} data-motion="transition-line" aria-hidden="true" />
      <div className="container"><div className={styles.closingContent}>
        <motion.h2 className="section-title" {...fadeUp(0)} animate={ctaInView ? { opacity: 1, y: 0 } : {}}>Curious about the ventures or want to connect?</motion.h2>
        <div className={styles.closingButtons}>
          <motion.div {...fadeUp(0.2)} animate={ctaInView ? { opacity: 1, y: 0 } : {}}><Link to="/ventures"><Button variant="primary" icon={<Briefcase size={16} />}>View My Ventures</Button></Link></motion.div>
          <motion.div {...fadeUp(0.32)} animate={ctaInView ? { opacity: 1, y: 0 } : {}}><Link to="/contact"><Button variant="outline" icon={<ArrowRight size={16} />}>Get Involved</Button></Link></motion.div>
        </div>
      </div></div>
    </section>
  </>;
}
