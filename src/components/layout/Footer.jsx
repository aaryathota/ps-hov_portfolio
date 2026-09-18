import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.css';
import { getContactSettings } from '@/api';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const siteLinks = [
  { href: '/ventures', label: 'Ventures' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Pratap' },
  { href: '/contact', label: 'Get in touch' },
];

export default function Footer() {
  const [settings, setSettings] = useState({});
  const footerRef = useRef(null);
  const wordRef = useRef(null);

  useEffect(() => {
    getContactSettings().then(setSettings);
  }, []);

  // The wordmark rises out of the bottom edge as the footer scrolls in
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(wordRef.current,
        { yPercent: 55, opacity: 0.25 },
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
          <p className={styles.leadLine}>Ventures built and run from Bangalore.</p>
          {settings.primary_email ? (
            <a className={styles.leadMail} href={`mailto:${settings.primary_email}`}>{settings.primary_email}</a>
          ) : (
            <Link className={styles.leadMail} to="/contact">Send a message</Link>
          )}
        </div>

        <nav className={styles.column} aria-label="Footer">
          {siteLinks.map((link) => (
            <Link key={link.href} to={link.href} className={styles.footerLink}>{link.label}</Link>
          ))}
        </nav>

        <div className={styles.column}>
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
        <p>© {new Date().getFullYear()} P.Sonkar House Of Ventures</p>
      </div>
    </footer>
  );
}
