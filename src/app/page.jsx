import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getContactSettings, getVentures } from '@/api';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import MinimalistHero from '@/components/ui/MinimalistHero';
import Magnetic from '@/components/motion/Magnetic';
import PageBackdrop from '@/components/ui/PageBackdrop';
import { mediaFor, pageMedia } from '@/data/media';
import styles from './page.module.css';

/* Version 5 home page.
   Hero: the 21st.dev minimalist hero template, unchanged apart from the photo.
   The venture list lives on its own page, so it is not repeated here. */

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'VENTURES', href: '/ventures' },
  { label: 'SERVICES', href: '/services' },
  { label: 'GET INVOLVED', href: '/contact' },
];

const WAYS = [
  { kicker: 'Invest', title: 'Back a Venture', body: 'I am building a small, focused set of ventures. If something in the portfolio interests you, there is a way to have that conversation.', href: '/contact?intent=invest' },
  { kicker: 'Work', title: 'Join the Team', body: 'Internships, part-time, and full-time roles across ventures in progress. Real work. Real ownership.', href: '/contact?intent=work' },
  { kicker: 'Grow', title: 'Grow Your Business', body: 'Looking for a growth partner who actually works with you? I have the resources and the experience to help.', href: '/contact?intent=grow' },
];

const QUOTE = 'I did not set out to build a venture studio. I set out to work on things I believed needed to exist. This is what that looks like so far.';

export default function HomePage() {
  const [ventures, setVentures] = useState([]);
  const [settings, setSettings] = useState({});
  const root = useRef(null);
  const tickerRef = useRef(null);
  const quoteRef = useRef(null);
  const waysRef = useRef(null);
  const closingRef = useRef(null);
  const statementRef = useRef(null);

  useEffect(() => {
    let alive = true;
    Promise.all([getVentures(), getContactSettings()]).then(([v, s]) => {
      if (!alive) return;
      setVentures(v.filter((item) => item.is_active !== false));
      setSettings(s || {});
    });
    return () => { alive = false; };
  }, []);

  const tickerNames = useMemo(() => ventures.map((v) => v.name), [ventures]);

  // This lucide version ships no brand icons, so the socials row uses labels
  const socialLinks = useMemo(() => [
    { label: 'LinkedIn', href: settings.linkedin_url },
    { label: 'Instagram', href: settings.instagram_url },
    { label: 'X', href: settings.twitter_url },
  ].filter((link) => link.href), [settings]);

  const doors = useMemo(() => {
    const first = ventures[0] ? mediaFor(ventures[0].name) : null;
    const second = ventures[3] ? mediaFor(ventures[3].name) : null;
    return [
      { eyebrow: 'The portfolio', title: 'Ventures', body: 'The businesses I started and run myself, each at its own stage.', href: '/ventures', image: first?.src, fallback: first?.fallback },
      { eyebrow: 'The work around it', title: 'Services', body: 'Design, marketing and legal partners I bring in when a venture or a client needs them.', href: '/services', image: second?.src, fallback: second?.fallback },
    ];
  }, [ventures]);

  /* Name ticker: speed follows scroll */
  useLayoutEffect(() => {
    if (!tickerNames.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      const loop = gsap.to('[data-ticker-row]', { xPercent: -50, ease: 'none', duration: 38, repeat: -1 });
      ScrollTrigger.create({
        trigger: tickerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = Math.min(Math.abs(self.getVelocity()) / 220, 7);
          gsap.to(loop, { timeScale: self.direction * (1 + boost), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.2, ease: 'power2.out' });
        },
      });
    }, tickerRef);
    return () => ctx.revert();
  }, [tickerNames.length]);

  /* Quote, headings, cards, closing */
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      if (quoteRef.current) {
        const split = SplitText.create('[data-quote]', { type: 'words' });
        gsap.fromTo(split.words, { opacity: 0.14 }, {
          opacity: 1, stagger: 0.05, ease: 'none',
          scrollTrigger: { trigger: quoteRef.current, start: 'top 75%', end: 'bottom 55%', scrub: true },
        });
      }
      gsap.utils.toArray('[data-heading]').forEach((heading) => {
        const split = SplitText.create(heading, { type: 'lines', mask: 'lines' });
        gsap.from(split.lines, {
          yPercent: 105, duration: 1.1, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
        });
      });
      gsap.from('[data-way-card]', {
        opacity: 0, y: 48, duration: 1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: waysRef.current, start: 'top 75%', once: true },
      });
      gsap.from('[data-door]', {
        opacity: 0, y: 60, duration: 1.1, stagger: 0.15, ease: 'expo.out',
        scrollTrigger: { trigger: '[data-doors]', start: 'top 80%', once: true },
      });
      // Statement line: words rise out of a mask as the band enters
      if (statementRef.current) {
        const split = SplitText.create('[data-statement]', { type: 'words', mask: 'words' });
        gsap.from(split.words, {
          yPercent: 115, duration: 1.2, stagger: 0.05, ease: 'expo.out',
          scrollTrigger: { trigger: statementRef.current, start: 'top 72%', once: true },
        });
        gsap.fromTo(statementRef.current, { clipPath: 'inset(8% 6% 8% 6% round 26px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: statementRef.current, start: 'top bottom', end: 'top 45%', scrub: 0.8 },
        });
      }

      // Image break: the photograph drifts slower than the page
      gsap.utils.toArray('[data-parallax]').forEach((image) => {
        gsap.fromTo(image, { yPercent: -8 }, {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      gsap.fromTo('[data-closing-box]', { clipPath: 'inset(42% 8% 42% 8% round 400px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
        scrollTrigger: { trigger: closingRef.current, start: 'top 90%', end: 'top 35%', scrub: true },
      });
    }, root);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(refresh); ctx.revert(); };
  }, [ventures.length]);

  return (
    <div ref={root} className={styles.page}>
      <MinimalistHero
        logoText="P.Sonkar"
        navLinks={NAV_LINKS}
        mainText="A founder-led ecosystem built around the ventures I build, the people I work with, and the opportunities I create."
        readMoreLink="/about"
        readMoreLabel="Read My Story"
        imageSrc="/images/founder_studio.webp"
        imageAlt="Pratap Sonkar"
        overlayText={{ part1: 'ideas in', part2: 'motion.' }}
        socialLinks={socialLinks}
        locationText="Bangalore, India"
      />

      {tickerNames.length > 0 && (
        <div ref={tickerRef} className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerRow} data-ticker-row>
            {[0, 1].map((copy) => (
              <div className={styles.tickerSet} key={copy}>
                {tickerNames.map((name) => (
                  <span className={styles.tickerItem} key={`${copy}-${name}`}>
                    {name}
                    <img src="/images/logomark-white.webp" alt="" className={styles.tickerMark}
          decoding="async" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <section ref={quoteRef} className={styles.quote} aria-label="In Pratap's words">
        <PageBackdrop
          src={(mediaFor('Rise For Change') || {}).src}
          fallback="/images/plates/rise-for-change.jpg"
          strength="page"
        />
        <blockquote className={styles.quoteBlock}>
          <p className={styles.quoteText} data-quote>{QUOTE}</p>
          <footer className={styles.quoteFooter}>
            <span>Pratap Sonkar</span>
            <Link to="/about" className={styles.linkUnderline}>Read My Story</Link>
          </footer>
        </blockquote>
      </section>

      {/* Statement band: a photograph carrying the line the site is built on */}
      <section className={styles.statement} ref={statementRef} aria-label="Ideas in motion">
        <img
          className={styles.statementPhoto}
          data-parallax
          src={pageMedia.statement.src}
          alt={pageMedia.statement.alt}
          loading="lazy"
          onError={(event) => { event.currentTarget.src = pageMedia.statement.fallback; }}
        />
        <span className={styles.statementVertical} aria-hidden="true">Ventures in progress</span>
        <div className={styles.statementInner}>
          <p className={styles.statementEyebrow} data-reveal>(Ideas in motion)</p>
          <h2 className={styles.statementTitle} data-statement>
            Small ventures, built properly,<br />
            <em>one at a time.</em>
          </h2>
        </div>
        <div className={styles.statementCaption} aria-hidden="true">
          <span>Bangalore, India</span>
          <span>P.Sonkar House Of Ventures</span>
        </div>
      </section>

      <section className={styles.doorsSection} data-doors aria-label="Where to go next">
        <div className={styles.doors}>
          {doors.map((door) => (
            <Link key={door.title} to={door.href} className={styles.door} data-door>
              <img
                className={styles.doorImage}
                src={door.image || door.fallback}
                alt=""
                loading="lazy"
                onError={(event) => { if (door.fallback) event.currentTarget.src = door.fallback; }}
              />
              <span className={styles.doorBody}>
                <span className={styles.doorEyebrow}>{door.eyebrow}</span>
                <span className={styles.doorTitle}>{door.title}</span>
                <span className={styles.doorText}>{door.body}</span>
                <span className={styles.doorLink}>Open <ArrowUpRight size={16} aria-hidden="true" /></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section ref={waysRef} className={styles.ways} aria-labelledby="ways-title">
        <PageBackdrop
          src={(mediaFor('LaptopWale.com') || {}).src}
          fallback="/images/plates/laptopwalecom.jpg"
          strength="page"
        />
        <span className={`section-label ${styles.sectionLabelBlock}`}>What This Is About</span>
        <h2 id="ways-title" className={styles.sectionTitle} data-heading>Three Ways to Be Part of This.</h2>
        <div className={styles.wayPanels}>
          {WAYS.map((way) => (
            <article key={way.title} className={styles.wayPanel} data-way-card>
              <div>
                <p className={styles.wayKicker}>{way.kicker}</p>
                <h3 className={styles.wayTitle}>{way.title}</h3>
              </div>
              <div className={styles.wayBody}>
                <p>{way.body}</p>
                <Link to={way.href} className={styles.btnPrimary}>
                  Get Involved <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section ref={closingRef} className={styles.closing}>
        <div className={styles.closingBox} data-closing-box>
          <h2 className={styles.closingTitle}>Something here catch your eye?</h2>
          <p className={styles.closingText}>
            Whether you want to invest, join a team, or grow your business, reach out and I will take it from there.
          </p>
          <div className={styles.closingButtons}>
            <Magnetic><Link to="/contact?intent=invest" className={styles.btnPrimaryLarge}>Invest</Link></Magnetic>
            <Magnetic><Link to="/contact?intent=work" className={styles.btnPrimaryLarge}>Work With Me</Link></Magnetic>
            <Magnetic><Link to="/contact?intent=grow" className={styles.btnPrimaryLarge}>Grow With Me</Link></Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}
