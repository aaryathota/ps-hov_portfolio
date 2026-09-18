import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/ventures', label: 'Ventures' },
  { href: '/services', label: 'Services' },
];

export default function Header() {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu with Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') setIsMobileMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
<<<<<<< HEAD
          <img className={styles.logoImage} src="/images/logo-white.webp" alt="P.Sonkar House of Ventures" width="270" height="57"
          decoding="async" />
          <img className={styles.logoMarkImage} src="/images/logomark-white.webp" alt="" aria-hidden="true"
          decoding="async" />
=======
          <img className={styles.logoImage} src="/images/logo-white.webp" alt="P.Sonkar House of Ventures" width="270" height="57" />
          <img className={styles.logoMarkImage} src="/images/logomark-white.webp" alt="" aria-hidden="true" />
>>>>>>> 8a231404a09dbddc638ea8f8089e0f1ab1eb8f49
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`${styles.navLink} ${
                pathname === link.href ? styles.active : ''
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <motion.span
                  className={styles.activeIndicator}
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <Link to="/contact" className={`${styles.navCta} ${pathname === '/contact' ? styles.navCtaActive : ''}`}>
            Get in touch
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.menuToggle}
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            id="mobile-nav"
            className={styles.mobileNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link
                  to={link.href}
                  className={`${styles.mobileNavLink} ${
                    pathname === link.href ? styles.active : ''
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <Link to="/contact" className={styles.mobileNavCta}>Get in touch</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
