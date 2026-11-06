'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion: do not initialize Lenis
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Connect Lenis to GSAP ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // Jump to top immediately on route changes or scroll to hash if present
  useEffect(() => {
    if (lenisRef.current) {
      if (window.location.hash) {
        const el = document.querySelector(window.location.hash);
        if (el) {
          lenisRef.current.scrollTo(el as HTMLElement, { offset: -64, immediate: true });
          return;
        }
      }
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Handle in-page anchor clicks smoothly with Lenis
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && (href.startsWith('/#') || href.startsWith('#'))) {
        const id = href.replace('/#', '').replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          // If already on the page where target exists
          if (window.location.pathname === '/' || href.startsWith('#')) {
            e.preventDefault();
            if (lenisRef.current) {
              lenisRef.current.scrollTo(el, { offset: -64, duration: 1.1 });
            } else {
              const top = el.getBoundingClientRect().top + window.scrollY - 64;
              window.scrollTo({ top, behavior: 'smooth' });
            }
            window.history.pushState(null, '', `#${id}`);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, true);
    return () => document.removeEventListener('click', handleAnchorClick, true);
  }, []);

  return null;
}

