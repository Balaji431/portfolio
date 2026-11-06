'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion or test harness blocking
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (window as unknown as { __blockHeroAnimation?: boolean }).__blockHeroAnimation
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      if (typeof window !== 'undefined' && (window as unknown as { __heroSafetyTimer?: number }).__heroSafetyTimer) {
        clearTimeout((window as unknown as { __heroSafetyTimer?: number }).__heroSafetyTimer);
      }

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          document.documentElement.classList.remove('js-motion-ready');
        },
      });

      tl.to('.hero-line', {
        yPercent: 0,
        y: 0,
        duration: 1.1,
        stagger: 0.12,
        clearProps: 'transform',
      }).to(
        '.hero-intro',
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          clearProps: 'opacity,transform',
        },
        '+=0.7' // the intro fades in 0.7s later
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="pt-20 sm:pt-28 md:pt-36 pb-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 md:px-10"
    >
      <div className="flex flex-col">
        <h1 className="font-serif text-[clamp(3.5rem,16vw,13rem)] leading-[0.88] tracking-[-0.03em] text-ink select-none font-normal">
          <span className="block overflow-hidden">
            <span className="block hero-line will-change-transform">Balaji</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block hero-line will-change-transform">Dasetti</span>
          </span>
        </h1>

        <div className="mt-12 sm:mt-16 md:mt-20 md:ml-auto md:w-3/5 lg:w-1/2">
          <p className="hero-intro text-lg sm:text-xl text-mute leading-relaxed max-w-[65ch]">
            I build the PHP and MySQL backend and the Flutter application on top of it, then deploy it on AWS and ship it to the app stores. Currently working on VStay, a college accommodation platform, at VianaSoft in Chennai.
          </p>
        </div>
      </div>
    </section>
  );
}

