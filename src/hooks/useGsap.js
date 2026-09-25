import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Creates a scoped GSAP context and reverts all animations on unmount.
 * Animation callbacks receive the shared GSAP and ScrollTrigger instances.
 */
export function useGsap(scope, createAnimation, dependencies = []) {
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return undefined;

    const context = gsap.context(() => {
      createAnimation(gsap, ScrollTrigger);
    }, scope);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [scope, createAnimation, prefersReducedMotion, ...dependencies]);
}
