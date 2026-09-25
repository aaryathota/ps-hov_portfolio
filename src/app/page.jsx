import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Gem, Cog, Sprout } from 'lucide-react';
import AnimatedText from '@/components/ui/AnimatedText';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import Ornament from '@/components/ui/Ornament';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { getVentures } from '@/api';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import styles from './page.module.css';

const WAYS = [
  {
    icon: Gem, tone: 'accent', kicker: 'Invest', heading: 'Back a venture',
    body: 'I am building a small, focused set of ventures. If something in the portfolio interests you, there is a way to have that conversation.',
    cta: 'Invest with me', href: '/contact?intent=invest',
  },
  {
    icon: Cog, tone: 'gold', kicker: 'Work', heading: 'Join the team',
    body: 'Internships, part-time, and full-time roles across ventures in progress. Real work. Real ownership.',
    cta: 'Work with me', href: '/contact?intent=work',
  },
  {
    icon: Sprout, tone: 'teal', kicker: 'Grow', heading: 'Grow your business',
    body: 'Looking for a growth partner who actually works with you? I have the resources and the experience to help.',
    cta: 'Grow with me', href: '/contact?intent=grow',
  },
];

const STEPS = [
  {
    numeral: 'I', title: 'Tell me what you are after',
    body: 'Invest, join a team, or grow your business. Pick the one that fits and share a few details through the form, email or WhatsApp.',
  },
  {
    numeral: 'II', title: 'We talk it through',
    body: 'A conversation about what you are looking for, the timeline, and what a good outcome looks like for both sides.',
  },
  {
    numeral: 'III', title: 'We build it together',
    body: 'The right venture, team or service in the network takes it forward, and I stay close to the work, not at a distance.',
  },
];

const QUOTE = 'I did not set out to build a venture studio. I set out to work on things I believed needed to exist. This is what that looks like so far.';

export default function HomePage() {
  const [ventures, setVentures] = useState([]);
  const root = useRef(null);
  const heroRef = useRef(null);
  const tickerRef = useRef(null);
  const stepsRef = useRef(null);
  const quoteRef = useRef(null);
  const closingRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getVentures().then((rows) => { if (alive) setVentures(rows.filter((row) => row.is_active !== false)); });
    return () => { alive = false; };
  }, []);


  /* ---------- Hero: one orchestrated entrance, then a quiet living state ---------- */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = heroRef.current;
      const title = hero.querySelector('[data-hero-title]');
      const lines = SplitText.create(title, { type: 'lines', mask: 'lines' });

      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .from('[data-hero-circle]', { scale: 0, duration: 1.3, transformOrigin: '50% 50%' }, 0.1)
        .from('[data-hero-ring]', { opacity: 0, scale: 0.86, duration: 1.4 }, 0.35)
        .fromTo('[data-hero-portrait]', { clipPath: 'inset(100% 0% 0% 0%)', y: 60 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.5 }, 0.55)
        .from('[data-hero-tagline]', { opacity: 0, y: 18, duration: 1 }, 0.9)
        .from(lines.lines, { yPercent: 108, duration: 1.2, stagger: 0.12 }, 1.0)
        .from('[data-hero-side] > *', { opacity: 0, y: 22, duration: 1, stagger: 0.12 }, 1.3)
        .from('[data-hero-cta] > *', { opacity: 0, y: 20, duration: 0.9, stagger: 0.1 }, 1.5)
        .from('[data-hero-note]', { opacity: 0, duration: 1 }, 1.8);

      // Slow ring, and a few pixels of breathing so the composition is never dead still
      gsap.to('[data-hero-ring]', { rotation: 360, duration: 60, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('[data-hero-float]', { y: -7, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      // The pointer nudges portrait, circle and ring by different amounts
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      let cleanup = () => {};
      if (fine) {
        const px = gsap.quickTo('[data-hero-portrait-wrap]', 'x', { duration: 1.1, ease: 'power3.out' });
        const cx = gsap.quickTo('[data-hero-back]', 'x', { duration: 1.4, ease: 'power3.out' });
        const cy = gsap.quickTo('[data-hero-back]', 'y', { duration: 1.4, ease: 'power3.out' });
        const move = (e) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          px(nx * 16); cx(nx * -10); cy(ny * -8);
        };
        const leave = () => { px(0); cx(0); cy(0); };
        hero.addEventListener('pointermove', move);
        hero.addEventListener('pointerleave', leave);
        cleanup = () => { hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); };
      }

      // On scroll the portrait lifts away slowly and the headline drifts up
      gsap.to('[data-hero-scroll="portrait"]', {
        yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('[data-hero-scroll="text"]', {
        y: -50, opacity: 0.35, ease: 'none',
        scrollTrigger: { trigger: hero, start: '30% top', end: 'bottom top', scrub: true },
      });

      return () => { cleanup(); lines.revert(); };
    }, heroRef);
    return () => mm.revert();
  }, []);

  /* ---------- Ticker: loops, and follows the scroll speed ---------- */
  useLayoutEffect(() => {
    if (!ventures.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      const loop = gsap.to('[data-ticker-row]', { xPercent: -50, ease: 'none', duration: 46, repeat: -1 });
      ScrollTrigger.create({
        trigger: tickerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = Math.min(Math.abs(self.getVelocity()) / 260, 6);
          gsap.to(loop, { timeScale: self.direction * (1 + boost), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.2, ease: 'power2.out' });
        },
      });
    }, tickerRef);
    return () => ctx.revert();
  }, [ventures.length]);

  /* ---------- Sections below the hero ---------- */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Quote: words brighten one by one as you read down the page
      if (quoteRef.current) {
        const split = SplitText.create('[data-quote]', { type: 'words' });
        gsap.fromTo(split.words, { opacity: 0.16 }, {
          opacity: 1, stagger: 0.06, ease: 'none',
          scrollTrigger: { trigger: quoteRef.current, start: 'top 72%', end: 'bottom 58%', scrub: true },
        });
      }
      // Ways: rule draws across the top of each panel, then the panel rises
      gsap.fromTo('[data-way]', { opacity: 0, y: 44 }, {
        opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '[data-ways]', start: 'top 78%', once: true },
      });
      gsap.fromTo('[data-way-rule]', { scaleX: 0 }, {
        scaleX: 1, duration: 1.3, stagger: 0.12, ease: 'expo.out', transformOrigin: 'left center',
        scrollTrigger: { trigger: '[data-ways]', start: 'top 78%', once: true },
      });
      // Steps: the gold line draws across as you read, numerals settle in turn
      if (stepsRef.current) {
        // Horizontal on wide screens, vertical when the steps stack
        const vertical = window.matchMedia('(max-width: 900px)').matches;
        gsap.fromTo('[data-steps-line]', vertical ? { scaleY: 0 } : { scaleX: 0 }, {
          ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
          ease: 'none', transformOrigin: vertical ? 'center top' : 'left center',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 80%', end: 'bottom 60%', scrub: 0.8 },
        });
        gsap.fromTo('[data-step-node]', { scale: 0.4, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'back.out(1.8)',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 75%', once: true },
        });
        gsap.fromTo('[data-step-copy]', { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: 'expo.out',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 72%', once: true },
        });
      }
      // Closing panel opens from a thin band as it scrolls in
      gsap.fromTo('[data-closing-box]', { clipPath: 'inset(38% 9% 38% 9% round 400px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
        scrollTrigger: { trigger: closingRef.current, start: 'top 92%', end: 'top 30%', scrub: true },
      });
      gsap.from('[data-closing-copy] > *', {
        opacity: 0, y: 28, duration: 1, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: closingRef.current, start: 'top 55%', once: true },
      });
    }, root);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(refresh); mm.revert(); };
  }, [ventures.length]);

  return (
    <div ref={root} className={styles.page}>
      {/* ============ HERO ============ */}
      <section ref={heroRef} className={`${styles.hero} grain`} aria-label="Introduction">
        <div className={styles.heroGrid}>
          <div className={styles.heroText} data-hero-scroll="text">
            <p className={styles.tagline} data-hero-tagline><span className="sheen">A network of ventures built for people and businesses to grow.</span></p>
            <h1 className={styles.title} data-hero-title>
              P.Sonkar<br />
              <span className={styles.titleSub}>House Of <em className={`serif-accent ${styles.titleSerif}`}>Ventures.</em></span>
            </h1>
            <div className={styles.heroCtas} data-hero-cta>
              <Button to="/ventures" size="lg" magnetic iconAfter={<ArrowUpRight size={18} />}>Explore ventures</Button>
              <Button to="/contact" size="lg" variant="outline" magnetic>Get involved</Button>
            </div>
          </div>

          <div className={styles.stage} data-hero-scroll="portrait" aria-hidden="false">
            <div className={styles.back} data-hero-back>
              <span className={styles.ring} data-hero-ring />
              <span className={styles.circle} data-hero-circle />
            </div>
            <div className={styles.portraitWrap} data-hero-portrait-wrap>
              <div data-hero-float>
                <img
                  className={styles.portrait}
                  data-hero-portrait
                  src="/images/founder.webp"
                  width="1015"
                  height="1194"
                  alt="Pratap Sonkar, founder"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          <div className={styles.heroSide} data-hero-side>
            <h2 className={styles.sideTitle}>A <span style={{ whiteSpace: 'nowrap' }}>founder-led</span> ecosystem.</h2>
            <p className={styles.sideText}>
              Built around the ventures I build, the people I work with, and the opportunities I create.
            </p>
            <Link to="/about" className={styles.textLink}>Read my story <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
        <p className={styles.heroNote} data-hero-note>Bangalore, India</p>
      </section>

      {/* ============ VENTURE NAME TICKER ============ */}
      {ventures.length > 0 && (
        <div ref={tickerRef} className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerRow} data-ticker-row>
            {[0, 1].map((copy) => (
              <div className={styles.tickerSet} key={copy}>
                {ventures.map((venture) => (
                  <span className={styles.tickerItem} key={`${copy}-${venture.name}`}>
                    {venture.name}
                    <img src="/images/logomark-white.webp" alt="" className={styles.tickerMark} width="400" height="378" decoding="async" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ THREE WAYS ============ */}
      <section className={`${styles.ways} section`} aria-labelledby="ways-title">
        <div className="container">
          <SectionLabel>What this ecosystem offers</SectionLabel>
          <AnimatedText id="ways-title" text="Three ways to be *part of this.*" as="h2" className={styles.h2} />
          <div className={styles.wayGrid} data-ways>
            {WAYS.map(({ icon: Icon, tone, kicker, heading, body, cta, href }) => (
              <SpotlightCard as="article" key={heading} className={`${styles.way} ${styles[tone]}`} data-way>
                <span className={styles.wayRule} data-way-rule aria-hidden="true" />
                <div className={styles.wayIcon}><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></div>
                <p className={styles.wayKicker}>{kicker}</p>
                <h3 className={styles.wayHeading}>{heading}</h3>
                <p className={styles.wayBody}>{body}</p>
                <Link to={href} className={styles.wayLink}>{cta} <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className={`${styles.steps} section`} aria-labelledby="steps-title">
        <div className="container">
          <div className={styles.stepsHead}>
            <div>
              <SectionLabel>How it works</SectionLabel>
              <AnimatedText id="steps-title" text="From first message to *real work.*" as="h2" className={styles.h2} />
            </div>
            <p className={styles.stepsSub} data-reveal>
              Whether you are investing, joining a team, or growing a business, it starts the same way.
            </p>
          </div>

          <div ref={stepsRef} className={styles.stepsWrap}>
          <span className={styles.stepsTrack} aria-hidden="true"><span className={styles.stepsLine} data-steps-line /></span>
          <ol className={styles.stepList}>
            {STEPS.map(({ numeral, title, body }) => (
              <li key={numeral} className={styles.step}>
                <span className={styles.stepNode} data-step-node aria-hidden="true">{numeral}</span>
                <div data-step-copy>
                  <h3 className={styles.stepTitle}>{title}</h3>
                  <p className={styles.stepBody}>{body}</p>
                </div>
              </li>
            ))}
          </ol>
          </div>

          <div className={styles.stepsActions} data-reveal>
            <Button to="/contact" iconAfter={<ArrowUpRight size={16} />}>Start the conversation</Button>
            <Link to="/about" className={styles.textLink}>How I work <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* ============ FOUNDER ============ */}
      <section ref={quoteRef} className={`${styles.founder} section`} aria-label="In Pratap's words">
        <div className={`container ${styles.founderInner}`}>
          <div className={styles.founderSide}>
            <SectionLabel>The person behind this</SectionLabel>
            <h2 className={styles.founderTitle}>I am <span className="serif-accent">Pratap Sonkar.</span></h2>
            <p className={styles.founderBody} data-reveal>
              I build ventures, enable collaborations, and work at the intersection of people, systems, and execution.
              P.Sonkar House Of Ventures is the ecosystem I have built around all of it.
            </p>
            <div data-reveal='2'>
              <Button to="/about" variant="outline" iconAfter={<ArrowUpRight size={16} />}>Read my story</Button>
            </div>
          </div>
          <blockquote className={styles.quote}>
            <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            <p className={styles.quoteText} data-quote>{QUOTE}</p>
            <footer className={styles.quoteFooter}>Pratap Sonkar, Founder</footer>
          </blockquote>
        </div>
      </section>

      {/* ============ CLOSING ============ */}
      <section ref={closingRef} className={styles.closing}>
        <div className={styles.closingBox} data-closing-box>
          <div className={styles.closingCopy} data-closing-copy>
            <Ornament center light />
            <h2 className={styles.closingTitle}>Something here <span className={`serif-accent ${styles.closingSerif}`}>catch your eye?</span></h2>
            <p className={styles.closingText}>
              Whether you want to invest, join a team, or grow your business, reach out and I will take it from there.
            </p>
            <div className={styles.closingButtons}>
              <Button to="/contact?intent=invest" variant="onDark" size="lg" magnetic>Invest</Button>
              <Button to="/contact?intent=work" variant="onDarkOutline" size="lg" magnetic>Work with me</Button>
              <Button to="/contact?intent=grow" variant="onDarkOutline" size="lg" magnetic>Grow with me</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
