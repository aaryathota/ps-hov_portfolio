import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, getServices } from '@/api';
import CoverflowCarousel from '@/components/ui/CoverflowCarousel';
import PageBackdrop from '@/components/ui/PageBackdrop';
import { mediaFor, pageMedia, serviceMedia } from '@/data/media';
import styles from './page.module.css';

/* Partner services, shown in the 3D coverflow carousel. */

const KIND = {
  'Brand Identity Studio': 'Design',
  'Digital Marketing Solutions': 'Growth',
  'Legal & Compliance': 'Structure',
};

const META = {
  'Brand Identity Studio': [
    { label: 'Focus', value: 'Identity, naming, collateral' },
    { label: 'Works with', value: 'Early-stage and corporate' },
  ],
  'Digital Marketing Solutions': [
    { label: 'Focus', value: 'Strategy, paid, content' },
    { label: 'Works with', value: 'Growing businesses' },
  ],
  'Legal & Compliance': [
    { label: 'Focus', value: 'Registration, compliance, tax' },
    { label: 'Works with', value: 'Startups and founders' },
  ],
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let alive = true;
    getServices().then((rows) => {
      if (alive) setServices(rows.filter((row) => row.is_active !== false));
    });
    return () => { alive = false; };
  }, []);

  const slides = useMemo(() => services.map((service) => {
    const media = mediaFor(service.name, serviceMedia) || {};
    return {
      src: service.image_url ? getImageUrl(service.image_url) : media.src,
      alt: `${service.name} background`,
      kind: KIND[service.name] || 'Partner service',
      title: service.name,
      subtitle: service.description,
      meta: META[service.name] || [],
      action: { label: `Ask about ${service.name}`, href: `/contact?venture=${encodeURIComponent(service.name)}` },
    };
  }), [services]);

  return (
    <div className={styles.page}>
      <PageBackdrop fixed src={pageMedia.services.src} fallback={pageMedia.services.fallback} />
      <header className={styles.head} data-reveal>
        <p className={styles.eyebrow}>Partner Services</p>
        <h1 className={styles.title}>The work around the ventures.</h1>
        <p className={styles.lede}>
          Businesses I work with closely. They run independently, and I bring them in when a venture or a client
          needs the work done well. Drag the rack, or use the arrow keys.
        </p>
      </header>

      {slides.length > 0 ? (
        <CoverflowCarousel slides={slides} label="Partner services" />
      ) : (
        <p className={styles.loading}>Loading services.</p>
      )}

      <section className={styles.tail} data-reveal>
        <h2 className={styles.tailTitle}>Need one of these for your business?</h2>
        <Link to="/contact?intent=grow" className={styles.tailButton}>Tell me what you need</Link>
      </section>
    </div>
  );
}
