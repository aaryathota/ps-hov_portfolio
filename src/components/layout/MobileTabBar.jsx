import { House, Layers, BriefcaseBusiness } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import styles from './MobileTabBar.module.css';

const tabs = [
  { href: '/', label: 'Home', icon: House },
  { href: '/ventures', label: 'Ventures', icon: Layers },
  { href: '/services', label: 'Services', icon: BriefcaseBusiness },
];

export default function MobileTabBar() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.bar} aria-label="Mobile navigation">
      {tabs.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href === '/ventures' && pathname === '/ventures');
        return (
          <Link key={href} to={href} className={isActive ? styles.active : styles.link} aria-current={isActive ? 'page' : undefined}>
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
