'use client';

import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop / devices with fine pointer (no touch devices)
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('a, button, [role="button"], input, textarea, select');
      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', checkHover, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', checkHover);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  if (!mounted || !isVisible) {
    return null;
  }

  const size = isHovered ? 40 : 12;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-accent/60 bg-accent/10 transition-[width,height,transform] duration-200 ease-out will-change-transform"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate3d(${position.x - size / 2}px, ${position.y - size / 2}px, 0)`,
      }}
    />
  );
}

