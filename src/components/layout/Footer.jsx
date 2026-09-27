import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, User } from 'lucide-react';
import styles from './Footer.module.css';
import { getContactSettings } from '@/api';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import SocialIcon, { SOCIAL_LABELS } from '@/components/ui/SocialIcons';

const siteLinks = [
  { href: '/ventures', label: 'Ventures' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Me' },
  { href: '/contact', label: 'Get involved' },
];

// Used until the admin panel's Contact details tab has its own links
const FALLBACK_SOCIALS = {
  instagram: 'https://instagram.com/psonkarventures',
  linkedin: 'https://linkedin.com/in/pratapsonkar',
  x: 'https://x.com/pratapsonkar',
};

const FOUNDER_NAME = 'Pratap Sonkar';

export default function Footer() {
  const [settings, setSettings] = useState({});
  const footerRef = useRef(null);
  const wordRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getContactSettings().then((value) => { if (alive) setSettings(value || {}); });
    return () => { alive = false; };
  }, []);

  // The wordmark rises into place once when it comes into view, and always
  // finishes fully visible (it is not tied to how far the page can scroll)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(wordRef.current,
        { yPercent: 60, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: wordRef.current, start: 'top bottom', once: true },
        });
    }, footerRef);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(id); ctx.revert(); };
  }, []);

  const socials = [
    ['instagram', settings.instagram_url || FALLBACK_SOCIALS.instagram],
    ['linkedin', settings.linkedin_url || FALLBACK_SOCIALS.linkedin],
    ['x', settings.twitter_url || FALLBACK_SOCIALS.x],
  ];

  const phone = settings.primary_whatsapp;
  const email = settings.primary_email;

  return (
    <footer className={styles.footer} ref={footerRef}>
      <div className={styles.inner}>
        <div className={styles.lead}>
          <Link to="/" className={styles.logo} aria-label="P.Sonkar House of Ventures, home">
            <img className={styles.logoImage} src="/images/logo-white.webp" width="900" height="189" alt="P.Sonkar House of Ventures" loading="lazy" decoding="async" />
          </Link>
          <p className={styles.tagline}>A network of ventures built for people and businesses to grow.</p>
          <div className={styles.socials} aria-label="Social media">
            {socials.map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={`${SOCIAL_LABELS[key]} (opens in a new tab)`}
                title={SOCIAL_LABELS[key]}
              >
                <SocialIcon name={key} />
              </a>
            ))}
          </div>
        </div>

        <nav className={styles.column} aria-label="Footer">
          <h2 className={styles.columnTitle}>Explore</h2>
          {siteLinks.map((link) => (
            <Link key={link.href} to={link.href} className={styles.footerLink}>{link.label}</Link>
          ))}
        </nav>

        <address className={styles.column}>
          <h2 className={styles.columnTitle}>Contact</h2>
          <span className={styles.contactItem}>
            <User size={14} aria-hidden="true" /> <span><span className={styles.contactLabel}>Name</span>{FOUNDER_NAME}</span>
          </span>
          {phone && (
            <a className={styles.contactItem} href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
              <Phone size={14} aria-hidden="true" /> <span><span className={styles.contactLabel}>Phone</span>{phone}</span>
            </a>
          )}
          {email && (
            <a className={styles.contactItem} href={`mailto:${email}`}>
              <Mail size={14} aria-hidden="true" /> <span><span className={styles.contactLabel}>Email</span>{email}</span>
            </a>
          )}
          <span className={styles.contactItem}>
            <MapPin size={14} aria-hidden="true" /> <span><span className={styles.contactLabel}>Place</span>{settings.location || 'Bangalore, Karnataka, India'}</span>
          </span>
        </address>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} P.Sonkar House Of Ventures. All rights reserved.</p>
      </div>

      {/* The last thing on every page: a large P.Sonkar, shown in full */}
      <div className={styles.wordmarkWrap} aria-hidden="true">
        <span ref={wordRef} className={styles.wordmark}>P.Sonkar</span>
      </div>
    </footer>
  );
}
