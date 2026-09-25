import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, getServices } from '@/api';
import CoverflowCarousel from '@/components/ui/CoverflowCarousel';
import ServicePlate from '@/components/ui/ServicePlate';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

/* Collaborated services, shown in a drag-and-arrow-key 3D carousel. */

const DETAIL = {
  'Brand Identity Studio': {
    kind: 'Design', plate: 'identity',
    meta: [{ label: 'Focus', value: 'Identity, naming, collateral' }, { label: 'Works with', value: 'Early-stage and corporate' }],
  },
  'Digital Marketing Solutions': {
    kind: 'Growth', plate: 'growth',
    meta: [{ label: 'Focus', value: 'Strategy, paid, content' }, { label: 'Works with', value: 'Growing businesses' }],
  },
  'Legal & Compliance': {
    kind: 'Structure', plate: 'structure',
    meta: [{ label: 'Focus', value: 'Registration, compliance, tax' }, { label: 'Works with', value: 'Startups and founders' }],
  },
};

const PLATE_ORDER = ['identity', 'growth', 'structure'];

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let alive = true;
    getServices().then((rows) => { if (alive) setServices(rows.filter((row) => row.is_active !== false)); });
    return () => { alive = false; };
  }, []);

  const slides = useMemo(() => services.map((service, index) => {
    const detail = DETAIL[service.name] || {};
    return {
      src: service.image_url ? getImageUrl(service.image_url) : undefined,
      plate: service.image_url ? undefined : <ServicePlate variant={detail.plate || PLATE_ORDER[index % 3]} />,
      alt: service.name,
      kind: detail.kind || 'Collaborated service',
      title: service.name,
      subtitle: service.description,
      meta: detail.meta || [],
      action: { label: `Ask about ${service.name}`, href: `/contact?venture=${encodeURIComponent(service.name)}` },
    };
  }), [services]);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div data-reveal><SectionLabel>Collaborated services</SectionLabel></div>
        <h1 className={styles.title} data-reveal="2">The work around the <span className="serif-accent">ventures.</span></h1>
        <p className={styles.lede} data-reveal="3">
          Services and businesses I am part of through active collaborations. They are managed independently and connected
          to this ecosystem through shared work. Drag the cards, or use the arrow keys.
        </p>
      </header>

      {slides.length > 0 ? (
        <CoverflowCarousel slides={slides} label="Collaborated services" />
      ) : (
        <p className={styles.loading}>Loading services.</p>
      )}

      <section className={styles.tail} data-reveal>
        <h2 className={styles.tailTitle}>Need one of these for <span className="serif-accent">your business?</span></h2>
        <Button to="/contact?intent=grow" size="lg">Tell me what you need</Button>
      </section>
    </div>
  );
}
