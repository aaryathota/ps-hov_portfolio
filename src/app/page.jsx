import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, ArrowRight, Gem, Cog, Sprout, Briefcase,
  Rocket, Lightbulb, ChartNoAxesCombined, Target, Handshake, Users, HandCoins, Megaphone,
  Building2, Settings, Star,
} from 'lucide-react';
import AnimatedText from '@/components/ui/AnimatedText';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import Ornament from '@/components/ui/Ornament';
import SpotlightCard from '@/components/ui/SpotlightCard';
import Arcs from '@/components/ui/Arcs';
import { getImageUrl, getVentures } from '@/api';
import { ventureMedia, ventureSlug } from '@/data/ventureMedia';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { whenIntroDone } from '@/lib/intro';
import styles from './page.module.css';

const TAGLINE = 'A network of ventures built for people and businesses to grow.';

// Numbers carried over from the previous site. Edit here to update them.
const KPIS = [
  { icon: Building2, value: 5, suffix: '', label: 'In-house ventures' },
  { icon: Settings, value: 10, suffix: '+', label: 'Services' },
  { icon: Users, value: 15, suffix: '+', label: 'Venture collaborations' },
  { icon: Star, value: 100, suffix: '%', label: 'Impact driven' },
];

// Start-up icons that ride the gold ring behind the portrait
// (HandCoins = fundraising, ChartNoAxesCombined = growth)
const RING_ICONS = [Rocket, Lightbulb, ChartNoAxesCombined, Target, Handshake, Users, HandCoins, Megaphone];

const WAYS = [
  {
    icon: Gem, tone: 'accent', kicker: 'Invest', heading: 'Back a venture',
    body: 'I am building a small, focused set of ventures. If something in the portfolio interests you, there is a way to have that conversation.',
    href: '/contact?intent=invest',
  },
  {
    icon: Cog, tone: 'gold', kicker: 'Work', heading: 'Join the team',
    body: 'Internships, part-time, and full-time roles across ventures in progress. Real work. Real ownership.',
    href: '/contact?intent=work',
  },
  {
    icon: Sprout, tone: 'teal', kicker: 'Grow', heading: 'Grow your business',
    body: 'Looking for a growth partner who actually works with you? I have the resources and the experience to help.',
    href: '/contact?intent=grow',
  },
];

const QUOTE = 'I did not set out to build a venture studio. I set out to work on things I believed needed to exist. This is what that looks like so far.';

// Ticker speed in pixels per second, the same on every screen size
const TICKER_SPEED = 64;

export default function HomePage() {
  const [ventures, setVentures] = useState([]);
  const root = useRef(null);
  const heroRef = useRef(null);
  const tickerRef = useRef(null);
  const kpiRef = useRef(null);
  const quoteRef = useRef(null);
  const closingRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getVentures().then((rows) => { if (alive) setVentures(rows.filter((row) => row.is_active !== false)); });
    return () => { alive = false; };
  }, []);

  /* ---------- Hero: one orchestrated entrance (after the logo intro), then a quiet living state ---------- */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = heroRef.current;
      const title = hero.querySelector('[data-hero-title]');
      const lines = SplitText.create(title, { type: 'lines', mask: 'lines' });

      const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, paused: true });
      intro
        .from('[data-hero-circle]', { scale: 0, duration: 1.3, transformOrigin: '50% 50%' }, 0.1)
        .from('[data-hero-ring]', { opacity: 0, scale: 0.86, duration: 1.4 }, 0.35)
        .from('[data-ring-badge]', { opacity: 0, scale: 0.4, duration: 0.8, stagger: 0.06, ease: 'back.out(2)' }, 0.8)
        .fromTo('[data-hero-portrait]', { clipPath: 'inset(100% 0% 0% 0%)', y: 60 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.5 }, 0.55)
        .from('[data-hero-tagline]', { opacity: 0, y: 18, scale: 0.92, duration: 1.1 }, 0.5)
        .from(lines.lines, { yPercent: 108, duration: 1.2, stagger: 0.12 }, 0.8)
        .from('[data-hero-side] > *', { opacity: 0, y: 22, duration: 1, stagger: 0.12 }, 1.1)
        .from('[data-hero-cta] > *', { opacity: 0, y: 20, duration: 0.9, stagger: 0.1 }, 1.3);
      const stopWaiting = whenIntroDone(() => intro.play());

      // Slow ring, the start-up icons ride it and stay upright
      gsap.to('[data-hero-ring]', { rotation: 360, duration: 60, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('[data-ring-icon]', { rotation: -360, duration: 60, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
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

      return () => { stopWaiting(); cleanup(); lines.revert(); };
    }, heroRef);
    return () => mm.revert();
  }, []);

  /* ---------- Ticker: always moving, same speed on laptop and phone; scrolling only speeds it up ---------- */
  useLayoutEffect(() => {
    if (!ventures.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const row = tickerRef.current?.querySelector('[data-ticker-row]');
    if (!row) return undefined;
    let loop;
    const build = () => {
      const width = row.firstElementChild.offsetWidth;
      if (!width) return;
      const progress = loop ? loop.progress() : 0;
      loop?.kill();
      gsap.set(row, { x: 0 });
      loop = gsap.to(row, { x: -width, duration: width / TICKER_SPEED, ease: 'none', repeat: -1 });
      loop.progress(progress);
    };
    build();
    const observer = new ResizeObserver(build);
    observer.observe(row.firstElementChild);

    const st = ScrollTrigger.create({
      trigger: tickerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (!loop) return;
        const boost = Math.min(Math.abs(self.getVelocity()) / 300, 4);
        gsap.to(loop, { timeScale: 1 + boost, duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' });
      },
    });
    return () => { observer.disconnect(); st.kill(); loop?.kill(); gsap.killTweensOf(row); };
  }, [ventures.length]);

  /* ---------- KPI numbers count up once ---------- */
  useLayoutEffect(() => {
    const node = kpiRef.current;
    if (!node) return undefined;
    const numbers = node.querySelectorAll('[data-kpi-value]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      numbers.forEach((el) => {
        const target = Number(el.dataset.kpiValue);
        const counter = { n: 0 };
        el.textContent = '0';
        gsap.to(counter, {
          n: target, duration: 1.6, ease: 'power2.out',
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
          onUpdate: () => { el.textContent = String(Math.round(counter.n)); },
        });
      });
      gsap.from('[data-kpi-card]', {
        opacity: 0, y: 24, duration: 0.9, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: node, start: 'top 90%', once: true },
      });
    }, node);
    return () => ctx.revert();
  }, []);

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
        <Arcs className={styles.heroArcs} />
        <div className={styles.heroGrid}>
          <div className={styles.heroText} data-hero-scroll="text">
            <p className={styles.taglinePill} data-hero-tagline>
              <span className={styles.pillGlow} aria-hidden="true" />
              <span className={`sheen ${styles.pillText}`}>{TAGLINE}</span>
            </p>
            <h1 className={styles.title} data-hero-title>
              P.Sonkar<br />
              <span className={styles.titleSub}>House Of <em className={`serif-accent ${styles.titleSerif}`}>Ventures.</em></span>
            </h1>
            <div className={styles.heroCtas} data-hero-cta>
              <Button to="/ventures" size="lg" magnetic iconAfter={<ArrowUpRight size={18} />}>Explore ventures</Button>
              <Button to="/services" size="lg" variant="outline" magnetic iconAfter={<ArrowUpRight size={18} />}>Explore services</Button>
            </div>
          </div>

          <div className={styles.stage} data-hero-scroll="portrait">
            <div className={styles.back} data-hero-back>
              <div className={styles.ring} data-hero-ring>
                {RING_ICONS.map((Icon, index) => {
                  const angle = (index / RING_ICONS.length) * Math.PI * 2 - Math.PI / 2;
                  return (
                    <span
                      key={index}
                      className={styles.ringBadge}
                      data-ring-badge
                      style={{ left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` }}
                      aria-hidden="true"
                    >
                      <span className={styles.ringIcon} data-ring-icon><Icon size={18} strokeWidth={1.7} /></span>
                    </span>
                  );
                })}
              </div>
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
              Built around the ventures I build, the people I work with, and the opportunities I create. Based in Bangalore.
            </p>
            <Button to="/contact" iconAfter={<ArrowUpRight size={16} />}>Get involved</Button>
          </div>
        </div>
      </section>

      {/* ============ VENTURE NAME TICKER ============ */}
      {ventures.length > 0 && (
        <div ref={tickerRef} className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerRow} data-ticker-row>
            {[0, 1, 2].map((copy) => (
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

      {/* ============ KPI STRIP ============ */}
      <section ref={kpiRef} className={styles.kpis} aria-label="At a glance">
        <div className={styles.kpiGrid}>
          {KPIS.map(({ icon: Icon, value, suffix, label }) => (
            <div key={label} className={styles.kpiCard} data-kpi-card>
              <span className={styles.kpiIcon}><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className={styles.kpiText}>
                <span className={styles.kpiValue}><span data-kpi-value={value}>{value}</span>{suffix}</span>
                <span className={styles.kpiLabel}>{label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HERE IS WHAT I AM BUILDING ============ */}
      <section className={`${styles.building} section`} aria-labelledby="building-title">
        <div className="container">
          <div className={styles.buildingHead}>
            <div>
              <SectionLabel>The portfolio</SectionLabel>
              <AnimatedText id="building-title" text="Here is what I am *building.*" as="h2" className={styles.h2} />
            </div>
            <div className={styles.buildingSide} data-reveal>
              <p>
                A set of ventures at different stages. Some are being actively developed. Some are still being shaped.
                All of them are being worked on with full intent.
              </p>
              <Button to="/ventures" variant="outline" iconAfter={<ArrowUpRight size={16} />}>View All Ventures</Button>
            </div>
          </div>
        </div>
        {ventures.length > 0 && <VentureScroller ventures={ventures} />}
      </section>

      {/* ============ THREE WAYS ============ */}
      <section className={`${styles.ways} section`} aria-labelledby="ways-title">
        <div className="container">
          <SectionLabel>What This Is About</SectionLabel>
          <AnimatedText id="ways-title" text="Three ways to be *part of this.*" as="h2" className={styles.h2} />
          <div className={styles.wayGrid} data-ways>
            {WAYS.map(({ icon: Icon, tone, kicker, heading, body, href }) => (
              <SpotlightCard as="article" key={heading} className={`${styles.way} ${styles[tone]}`} data-way>
                <span className={styles.wayRule} data-way-rule aria-hidden="true" />
                <div className={styles.wayIcon}><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></div>
                <p className={styles.wayKicker}>{kicker}</p>
                <h3 className={styles.wayHeading}>{heading}</h3>
                <p className={styles.wayBody}>{body}</p>
                <Link to={href} className={styles.wayLink}>Get involved <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </SpotlightCard>
            ))}
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
            {/* On laptops the button sits here; on phones it moves below the quote */}
            <div className={styles.storyDesktop} data-reveal="2">
              <Button to="/about" variant="outline" iconAfter={<ArrowUpRight size={16} />}>Read my story</Button>
            </div>
          </div>
          <blockquote className={styles.quote}>
            <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            <p className={styles.quoteText} data-quote>{QUOTE}</p>
            <footer className={styles.quoteFooter}>Pratap Sonkar, Founder</footer>
          </blockquote>
          <div className={styles.storyMobile}>
            <Button to="/about" variant="outline" iconAfter={<ArrowUpRight size={16} />}>Read my story</Button>
          </div>
        </div>
      </section>

      {/* ============ CLOSING ============ */}
      <section ref={closingRef} className={styles.closing}>
        <div className={styles.closingBox} data-closing-box>
          <Arcs tone="light" className={styles.closingArcs} />
          <div className={styles.closingCopy} data-closing-copy>
            <Ornament center light />
            <h2 className={styles.closingTitle}>Something here <span className={`serif-accent ${styles.closingSerif}`}>catch your eye?</span></h2>
            <p className={styles.closingText}>
              Whether you want to invest, join a team, or grow your business, reach out and I will take it from there.
            </p>
            <div className={styles.closingButtons}>
              <Button to="/ventures" variant="onDarkOutline" size="lg" magnetic icon={<Briefcase size={17} />}>View My Ventures</Button>
              <Button to="/services" variant="onDarkOutline" size="lg" magnetic iconAfter={<ArrowUpRight size={18} />}>Explore Services</Button>
              <Button to="/contact" variant="onDark" size="lg" magnetic iconAfter={<ArrowRight size={18} />}>Get Involved</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/*
  Venture cards that scroll on their own, slowly and continuously.
  Hovering (or touching) pauses it, and it can be swiped or dragged by hand;
  it picks up again a moment after you let go.
*/
function VentureScroller({ ventures }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const SPEED = 38; // px per second
    let pos = track.scrollLeft;
    let paused = false;
    let resumeTimer = 0;
    let last = performance.now();
    let raf = 0;

    const half = () => track.scrollWidth / 2;
    const step = (now) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      if (!paused) {
        pos += SPEED * dt;
        if (pos >= half()) pos -= half();
        track.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const pause = () => { paused = true; window.clearTimeout(resumeTimer); };
    const resumeSoon = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => { pos = track.scrollLeft; paused = false; }, 1600);
    };
    const onScroll = () => {
      // Someone scrolled it by hand: follow them, and wrap round seamlessly
      if (paused) {
        if (track.scrollLeft >= half()) track.scrollLeft -= half();
        pos = track.scrollLeft;
      }
    };
    const hover = window.matchMedia('(hover: hover)').matches;
    track.addEventListener('pointerenter', hover ? pause : () => {});
    track.addEventListener('pointerleave', hover ? resumeSoon : () => {});
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resumeSoon, { passive: true });
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', resumeSoon);
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer);
      track.removeEventListener('pointerenter', pause);
      track.removeEventListener('pointerleave', resumeSoon);
      track.removeEventListener('touchstart', pause);
      track.removeEventListener('touchend', resumeSoon);
      track.removeEventListener('focusin', pause);
      track.removeEventListener('focusout', resumeSoon);
      track.removeEventListener('scroll', onScroll);
    };
  }, [ventures.length]);

  return (
    <div className={styles.scroller}>
      <div ref={trackRef} className={styles.scrollerTrack} role="list" aria-label="Ventures">
        {[0, 1].map((copy) => ventures.map((venture, index) => {
          const media = ventureMedia(venture, index);
          const image = venture.image_url ? getImageUrl(venture.image_url) : media.thumb;
          return (
            <Link
              key={`${copy}-${venture.id || venture.name}`}
              to={`/ventures#${ventureSlug(venture.name)}`}
              className={styles.ventureCard}
              role="listitem"
              aria-hidden={copy === 1 ? 'true' : undefined}
              tabIndex={copy === 1 ? -1 : undefined}
              draggable={false}
            >
              <span className={styles.ventureImage}>
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{ objectPosition: media.kind === 'screenshot' && !venture.image_url ? '50% 0%' : media.position }}
                />
              </span>
              <span className={styles.ventureBody}>
                <span className={styles.ventureName}>{venture.name}</span>
                <span className={styles.ventureMore}>Explore <ArrowUpRight size={15} aria-hidden="true" /></span>
              </span>
            </Link>
          );
        }))}
      </div>
    </div>
  );
}
