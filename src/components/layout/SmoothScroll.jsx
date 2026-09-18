import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Lenis smooth scroll provider.
 * Wraps the entire app to provide silky momentum scrolling
 * that pairs with GSAP ScrollTrigger for 3D animations.
 */
export default function SmoothScroll({ children }) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      // Longer glide and a gentler curve: the page carries momentum instead
      // of snapping to a stop.
      duration: 1.6,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t)),
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      smoothWheel: true,
      // Smooth-scroll #hash links (e.g. Explore Ventures). The header offset comes from
      // the scroll-margin-top rule in globals.css, so no extra offset here.
      anchors: true,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const raf = (time) => lenis.raf(time * 1000);

    lenis.on('scroll', updateScrollTrigger);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', updateScrollTrigger);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
