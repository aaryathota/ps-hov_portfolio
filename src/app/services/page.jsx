import { useEffect, useMemo, useState } from 'react';
import { getImageUrl, getSiteSettings } from '@/api';
import { defaultSiteSettings } from '@/data/siteContent';
import CircularGallery from '@/components/ui/CircularGallery';
import SectionLabel from '@/components/ui/SectionLabel';
import Arcs from '@/components/ui/Arcs';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

/* Services, shown on a 3D ring that turns as you scroll. */

// Drawing for each service already in the admin panel; any new one gets the cycle below
const GRAPHICS = {
  'Brand Identity Studio': 'brand-identity',
  'Digital Marketing Solutions': 'digital-marketing',
  'Legal & Compliance': 'legal-compliance',
};
const GRAPHIC_CYCLE = ['brand-identity', 'digital-marketing', 'legal-compliance'];

const contactHref = (title) => (title ? `/contact?venture=${encodeURIComponent(title)}` : '/contact');

export default function ServicesPage() {
  const [services, setServices] = useState(defaultSiteSettings.services);
  const [copy, setCopy] = useState(defaultSiteSettings.pages.services);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    getSiteSettings().then((settings) => {
      if (!alive) return;
      setServices(settings.services.filter((row) => row.is_active !== false));
      setCopy(settings.pages.services);
      setLoaded(true);
    });
    return () => { alive = false; };
  }, []);

  const items = useMemo(() => services.map((service, index) => ({
      graphic: service.graphic || GRAPHICS[service.name] || GRAPHIC_CYCLE[index % GRAPHIC_CYCLE.length],
      id: service.id || service.name,
      title: service.name,
      tagline: service.tagline,
      description: service.description,
      image: service.image || (service.image_url ? getImageUrl(service.image_url) : undefined),
      action: { label: service.ctaLabel || "Let's Talk", href: contactHref(service.name || service.title) },
    })), [services]);

  return (
    <div className={styles.page}>
      <Arcs className={styles.arcs} />
      <header className={styles.head}>
        <div data-reveal><SectionLabel>{copy.label}</SectionLabel></div>
        <h1 className={styles.title} data-reveal="2">{copy.title}</h1>
        <p className={styles.lede} data-reveal="3">{copy.intro}</p>
      </header>

      {loaded ? (
        <CircularGallery items={items} label="Services" />
      ) : (
        <p className={styles.loading}>Loading services.</p>
      )}

      <section className={styles.tail} data-reveal>
        <div className={styles.tailCopy}>
          <h2 className={styles.tailTitle}>{copy.tailTitle}</h2>
          <p className={styles.tailText}>{copy.tailText}</p>
        </div>
        <Button to="/contact" size="lg">{copy.tailButton}</Button>
      </section>
    </div>
  );
}
