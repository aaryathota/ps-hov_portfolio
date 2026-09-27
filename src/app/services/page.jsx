import { useEffect, useMemo, useState } from 'react';
import { getImageUrl, getServices } from '@/api';
import CoverflowCarousel from '@/components/ui/CoverflowCarousel';
import ServicePlate from '@/components/ui/ServicePlate';
import SectionLabel from '@/components/ui/SectionLabel';
import Arcs from '@/components/ui/Arcs';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

/* Collaborated services, shown in a drag-and-arrow-key 3D carousel. */

// Drawn cover for each service until a real image is uploaded in the admin panel
const PLATES = {
  'Brand Identity Studio': 'identity',
  'Digital Marketing Solutions': 'growth',
  'Legal & Compliance': 'structure',
};

const PLATE_ORDER = ['identity', 'growth', 'structure'];

// The cards move on by themselves every 15 seconds
const AUTOPLAY_MS = 15000;

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let alive = true;
    getServices().then((rows) => { if (alive) setServices(rows.filter((row) => row.is_active !== false)); });
    return () => { alive = false; };
  }, []);

  const slides = useMemo(() => services.map((service, index) => ({
    src: service.image_url ? getImageUrl(service.image_url) : undefined,
    plate: service.image_url ? undefined : <ServicePlate variant={PLATES[service.name] || PLATE_ORDER[index % 3]} />,
    alt: service.name,
    kind: 'Collaborated Service',
    title: service.name,
    subtitle: service.description,
    action: { label: 'Enquire about this service', href: `/contact?venture=${encodeURIComponent(service.name)}` },
  })), [services]);

  return (
    <div className={styles.page}>
      <Arcs className={styles.arcs} />
      <header className={styles.head}>
        <div data-reveal><SectionLabel>The Portfolio</SectionLabel></div>
        <h1 className={styles.title} data-reveal="2">Collaborated <span className="serif-accent">Services.</span></h1>
        <p className={styles.lede} data-reveal="3">
          Services and businesses I am part of through active collaborations. These are managed independently but connected
          to this ecosystem through shared work and partnerships built over time.
        </p>
      </header>

      {slides.length > 0 ? (
        <CoverflowCarousel slides={slides} label="Collaborated services" autoplay={AUTOPLAY_MS} cardWidth="clamp(210px, 58vw, 330px)" />
      ) : (
        <p className={styles.loading}>Loading services.</p>
      )}

      <section className={styles.tail} data-reveal>
        <div className={styles.tailCopy}>
          <h2 className={styles.tailTitle}>See something that <span className="serif-accent">interests you?</span></h2>
          <p className={styles.tailText}>Reach out whether you want to invest, join a team, or collaborate. I personally review every message.</p>
        </div>
        <Button to="/contact" size="lg">Get Involved</Button>
      </section>
    </div>
  );
}
