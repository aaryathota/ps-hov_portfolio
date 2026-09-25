import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.css';
import { getContactSettings } from '@/api';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const siteLinks = [
  { href: '/ventures', label: 'Ventures' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About the founder' },
  { href: '/contact', label: 'Get involved' },
];

export default function Footer() {
  const [settings, setSettings] = useState({});
  const footerRef = useRef(null);
  const wordRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getContactSettings().then((value) => { if (alive) setSettings(value || {}); });
    return () => { alive = false; };
  }, []);

  // The wordmark rises out of the bottom edge as the footer scrolls into view
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(wordRef.current,
        { yPercent: 48, opacity: 0.4 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: footerRef.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        });
    }, footerRef);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(id); ctx.revert(); };
  }, []);

  const socials = [
    ['LinkedIn', settings.linkedin_url],
    ['Instagram', settings.instagram_url],
    ['X', settings.twitter_url],
  ].filter(([, url]) => url);

  return (
    <footer className={styles.footer} ref={footerRef}>
      <div className={styles.inner}>
        <div className={styles.lead}>
          <Link to="/" className={styles.logo} aria-label="P.Sonkar House of Ventures, home">
            <img className={styles.logoImage} src="/images/logo-white.webp" width="900" height="189" alt="P.Sonkar House of Ventures" loading="lazy" decoding="async" />
          </Link>
          <p className={styles.tagline}>A network of ventures built for people and businesses to grow.</p>
          {settings.primary_email ? (
            <a className={styles.leadMail} href={`mailto:${settings.primary_email}`}>{settings.primary_email}</a>
          ) : (
            <Link className={styles.leadMail} to="/contact">Send a message</Link>
          )}
        </div>

        <nav className={styles.column} aria-label="Footer">
          <h2 className={styles.columnTitle}>Explore</h2>
          {siteLinks.map((link) => (
            <Link key={link.href} to={link.href} className={styles.footerLink}>{link.label}</Link>
          ))}
        </nav>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Contact</h2>
          {settings.primary_whatsapp && (
            <a className={styles.contactItem} href={`tel:${settings.primary_whatsapp}`}>
              <Phone size={14} aria-hidden="true" /> {settings.primary_whatsapp}
            </a>
          )}
          {settings.primary_email && (
            <a className={styles.contactItem} href={`mailto:${settings.primary_email}`}>
              <Mail size={14} aria-hidden="true" /> Email
            </a>
          )}
          <span className={styles.contactItem}>
            <MapPin size={14} aria-hidden="true" /> {settings.location || 'Bangalore, Karnataka, India'}
          </span>
          {socials.length > 0 && (
            <div className={styles.socials}>
              {socials.map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>{label}</a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.wordmarkWrap} aria-hidden="true">
        <span ref={wordRef} className={styles.wordmark}>P.Sonkar</span>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} P.Sonkar House Of Ventures. All rights reserved.</p>
      </div>
    </footer>
  );
}
