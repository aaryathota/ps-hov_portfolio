import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import PageTransition from '@/components/layout/PageTransition';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Ambience from '@/components/motion/Ambience';
<<<<<<< HEAD
import ScrollProgress from '@/components/motion/ScrollProgress';
=======
>>>>>>> 8a231404a09dbddc638ea8f8089e0f1ab1eb8f49
import HomePage from '@/app/page.jsx';

// Only the homepage ships in the first download. Other pages (and the admin
// panel, which no visitor needs) load on demand.
const AboutPage = lazy(() => import('@/app/about/page.jsx'));
const VenturesPage = lazy(() => import('@/app/ventures/page.jsx'));
const ContactPage = lazy(() => import('@/app/contact/page.jsx'));
const ServicesPage = lazy(() => import('@/app/services/page.jsx'));
const AdminPanel = lazy(() => import('@/adminpanel'));

// SEO titles and descriptions from full_spec.txt (Version 4)
const pageMeta = {
  '/': {
    title: 'Pratap Sonkar | P.Sonkar House Of Ventures, Bangalore',
    description: 'I am Pratap Sonkar, a founder and builder based in Bangalore. P.Sonkar House Of Ventures is the ecosystem behind the ventures I build, the collaborations I enable, and the opportunities I create.',
  },
  '/about': {
    title: 'About Pratap Sonkar | Founder, P.Sonkar House Of Ventures, Bangalore',
    description: 'I am Pratap Sonkar, founder of P.Sonkar House Of Ventures. Here is my story, how I work, and what drives the ventures I build in Bangalore.',
  },
  '/ventures': {
    title: 'Ventures | P.Sonkar House Of Ventures Portfolio, Bangalore',
    description: 'Explore the ventures I am building and the services I collaborate on through P.Sonkar House Of Ventures. Everything here is a work in progress, being built with full intent.',
  },
  '/services': {
    title: 'Partner Services | P.Sonkar House Of Ventures, Bangalore',
    description: 'Explore the ventures I am building and the services I collaborate on through P.Sonkar House Of Ventures. Everything here is a work in progress, being built with full intent.',
  },
  '/contact': {
    title: 'Get Involved | Invest, Work, or Grow With P.Sonkar House Of Ventures, Bangalore',
    description: 'Want to invest in a venture, join a team, or grow your business with my ecosystem? Tell me what you are looking for and I will take it from there.',
  },
  '/admin': { title: 'Admin | P.Sonkar House Of Ventures', description: '' },
};

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el && value) el.setAttribute(attr, value);
}

/* Reveal on scroll: any element with data-reveal rises in once, the pattern
   used across the reference sites. Re-runs on every route change. */
function useRevealOnScroll(pathname) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    const attach = () => document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => observer.observe(el));
    const timers = [120, 600, 1400].map((ms) => window.setTimeout(attach, ms));
    attach();
    return () => { timers.forEach((id) => window.clearTimeout(id)); observer.disconnect(); };
  }, [pathname]);
}

function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = pageMeta[pathname] || pageMeta['/'];
    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:url"]', 'content', `${window.location.origin}${pathname}`);
    setMeta('link[rel="canonical"]', 'href', `${window.location.origin}${pathname}`);
    // Keep the admin panel out of search results
    setMeta('meta[name="robots"]', 'content', pathname.startsWith('/admin') ? 'noindex, nofollow' : 'index, follow');
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  useRevealOnScroll(location.pathname);
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <>
        <PageMeta />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </>
    );
  }

  return (
    <SmoothScroll>
      <a href="#main" className="skip-link">Skip to content</a>
<<<<<<< HEAD
      <ScrollProgress />
=======
>>>>>>> 8a231404a09dbddc638ea8f8089e0f1ab1eb8f49
      <Ambience />
      <PageMeta />
      {location.pathname !== '/' && <Header />}
      <main id="main" className="publicMain" tabIndex={-1}>
        <PageTransition
          renderPage={(pageLocation) => (
            <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
              <Routes location={pageLocation}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/ventures" element={<VenturesPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          )}
        />
      </main>
      <Footer />
      <MobileTabBar />
    </SmoothScroll>
  );
}
