'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface BoxDimensions {
  width: number;
  height: number;
  closedHeight: number;
  d: number;
  xc: number;
  yc: number;
  xr: number;
  yb: number;
  isMobile: boolean;
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const nameButtonRef = useRef<HTMLButtonElement>(null);
  const travelBoxRef = useRef<HTMLDivElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const photoWrapperRef = useRef<HTMLDivElement>(null);
  const photoButtonRef = useRef<HTMLButtonElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const controlLineRef = useRef<HTMLDivElement>(null);

  const loopTlRef = useRef<gsap.core.Timeline | null>(null);
  const isOpenRef = useRef(false);
  const isManualPausedRef = useRef(false);
  const isPointerOverRef = useRef(false);
  const isFocusedRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const isOffscreenRef = useRef(false);
  const isHiddenRef = useRef(false);
  const pointerDownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const boxDimensionsRef = useRef<BoxDimensions>({
    width: 440,
    height: 400,
    closedHeight: 400,
    d: 160,
    xc: 140,
    yc: 120,
    xr: 280,
    yb: 240,
    isMobile: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const isReducedMotionRef = useRef(false);
  const [hasImageError, setHasImageError] = useState(false);
  const imagePreloadedRef = useRef(false);
  const fallbackPreloadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ignoreHoverUntilRef = useRef<number>(0);
  const hasPointerMovedAfterOpenRef = useRef<boolean>(false);
  const clickPointerPosRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });

  // Sync state to refs
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    isManualPausedRef.current = isManualPaused;
  }, [isManualPaused]);

  // Preload photo silently after reveal or fallback timeout
  const preloadPhoto = useCallback(() => {
    if (typeof window !== 'undefined' && !imagePreloadedRef.current) {
      imagePreloadedRef.current = true;
      const doLoad = () => {
        if (typeof fetch === 'function') {
          fetch('/me.webp', { priority: 'low' } as RequestInit).catch(() => {});
        } else {
          const img = new window.Image();
          img.decoding = 'async';
          img.src = '/me.webp';
        }
      };
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(doLoad, { timeout: 4000 });
      } else {
        setTimeout(doLoad, 500);
      }
    }
  }, []);

  // Measure travel box dimensions according to exact specifications
  const measureBox = useCallback(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 768;
    const heading = headingWrapperRef.current;
    const travelBox = travelBoxRef.current;
    if (!heading || !travelBox) return;

    const lineEls = heading.querySelectorAll<HTMLElement>('.hero-line');
    if (!lineEls || lineEls.length < 2) return;

    const span0 = lineEls[0].parentElement as HTMLElement;
    const span1 = lineEls[1].parentElement as HTMLElement;
    if (!span0 || !span1) return;

    if (isMobile) {
      // Mobile (< 768px): text-column width by 280px tall, top-left aligned with the name
      const colWidth = travelBox.parentElement?.clientWidth || window.innerWidth - 32;
      const s0r = span0.getBoundingClientRect();
      const s1r = span1.getBoundingClientRect();
      const nameH = Math.ceil(s1r.bottom - s0r.top) || heading.offsetHeight || 120;
      const W = Math.round(colWidth);
      const H = 280;
      const d = 110;
      const xr = Math.max(0, W - d);
      const yb = Math.max(0, H - d);
      const xc = xr / 2;
      const yc = yb / 2;

      boxDimensionsRef.current = {
        width: W,
        height: H,
        closedHeight: nameH,
        d,
        xc,
        yc,
        xr,
        yb,
        isMobile: true,
      };
      if (circleRef.current) {
        circleRef.current.style.width = `${d}px`;
        circleRef.current.style.height = `${d}px`;
      }
    } else {
      // Desktop (>= 768px): exact bounding box of the two-line name block in its closed state
      // same left edge, same top
      // width = widest of the two name lines (measured with getBoundingClientRect on line elements)
      // height = full two-line block height (including line padding for 'j' descender fix)
      const line0Rect = lineEls[0].getBoundingClientRect();
      const line1Rect = lineEls[1].getBoundingClientRect();
      const span0Rect = span0.getBoundingClientRect();
      const span1Rect = span1.getBoundingClientRect();

      const maxLineWidth = Math.max(line0Rect.width, line1Rect.width);
      const blockHeight = span1Rect.bottom - span0Rect.top;

      const boxW = Math.ceil(maxLineWidth);
      const boxH = Math.ceil(blockHeight);

      // Photo diameter on desktop: clamp(150px, 15vw, 210px), but never more than 45% of height and 45% of width
      const baseD = Math.min(210, Math.max(150, window.innerWidth * 0.15));
      const maxD = Math.floor(Math.min(boxW * 0.45, boxH * 0.45));
      const d = Math.max(100, Math.min(baseD, maxD));

      const xr = Math.max(0, boxW - d);
      const yb = Math.max(0, boxH - d);
      const xc = xr / 2;
      const yc = yb / 2;

      boxDimensionsRef.current = {
        width: boxW,
        height: boxH,
        closedHeight: boxH,
        d,
        xc,
        yc,
        xr,
        yb,
        isMobile: false,
      };
      if (circleRef.current) {
        circleRef.current.style.width = `${d}px`;
        circleRef.current.style.height = `${d}px`;
      }
    }
  }, []);

  // Measurement listeners: observe resize only while photo is open
  useEffect(() => {
    if (!isOpen) return;

    measureBox();

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        measureBox();
        loopTlRef.current?.invalidate();
      });
    }

    const handleResize = () => {
      measureBox();
      loopTlRef.current?.invalidate();
    };
    window.addEventListener('resize', handleResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && headingWrapperRef.current) {
      ro = new ResizeObserver(() => {
        measureBox();
        loopTlRef.current?.invalidate();
      });
      ro.observe(headingWrapperRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      ro?.disconnect();
    };
  }, [isOpen, measureBox]);

  // Check hint dismissal and reduced motion on mount
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('portfolio-hero-hint-dismissed');
      if (!dismissed) {
        setShowHint(true);
      }
    } catch {}

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(reducedQuery.matches);
    isReducedMotionRef.current = reducedQuery.matches;

    const onMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      isReducedMotionRef.current = e.matches;
    };
    reducedQuery.addEventListener('change', onMotionChange);

    // Silent preload fallback after 1.5s if hero animation does not run
    if (reducedQuery.matches || (window as unknown as { __blockHeroAnimation?: boolean }).__blockHeroAnimation) {
      fallbackPreloadTimerRef.current = setTimeout(preloadPhoto, 1500);
    }

    return () => {
      if (fallbackPreloadTimerRef.current) clearTimeout(fallbackPreloadTimerRef.current);
      reducedQuery.removeEventListener('change', onMotionChange);
    };
  }, [preloadPhoto]);

  // Initial hero reveal animation
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (window as unknown as { __blockHeroAnimation?: boolean }).__blockHeroAnimation
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero reveal animation is active: cancel fallback preload timer
      if (fallbackPreloadTimerRef.current) {
        clearTimeout(fallbackPreloadTimerRef.current);
        fallbackPreloadTimerRef.current = null;
      }
      if (typeof window !== 'undefined' && (window as unknown as { __heroSafetyTimer?: number }).__heroSafetyTimer) {
        clearTimeout((window as unknown as { __heroSafetyTimer?: number }).__heroSafetyTimer);
      }

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          preloadPhoto();
        },
      });

      const isMobile = window.innerWidth < 768;
      const lineDuration = isMobile ? 0.6 : 1.0;
      const staggerTime = isMobile ? 0.05 : 0.1;
      const introDuration = isMobile ? 0.5 : 0.7;

      tl.to('.hero-line', {
        yPercent: 0,
        y: 0,
        duration: lineDuration,
        stagger: staggerTime,
        clearProps: 'transform',
      }).to(
        '.hero-intro',
        {
          opacity: 1,
          y: 0,
          duration: introDuration,
          clearProps: 'opacity,transform',
        },
        isMobile ? '-=0.2' : '-=0.3'
      );
    }, heroRef);

    return () => ctx.revert();
  }, [preloadPhoto]);

  // Get current travel stops from measured dimensions
  const getTravelStops = useCallback(() => {
    return boxDimensionsRef.current;
  }, []);

  // Central pause manager
  const updatePauseState = useCallback(() => {
    const loop = loopTlRef.current;
    if (!loop) return;

    const isHoverIgnored = Date.now() < ignoreHoverUntilRef.current;
    const effectivePointerOver = isHoverIgnored ? false : isPointerOverRef.current;

    const shouldPause =
      isManualPausedRef.current ||
      effectivePointerOver ||
      isFocusedRef.current ||
      isPointerDownRef.current ||
      isOffscreenRef.current ||
      isHiddenRef.current;

    if (shouldPause) {
      if (!loop.paused()) {
        loop.pause();
      }
    } else {
      if (loop.paused() && isOpenRef.current) {
        loop.resume();
      }
    }
  }, []);

  // Periodic pointer check and pointermove tracking to resume when pointer is no longer over photo
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
      if (isOpenRef.current) {
        const dx = Math.abs(e.clientX - clickPointerPosRef.current.x);
        const dy = Math.abs(e.clientY - clickPointerPosRef.current.y);
        if (dx > 4 || dy > 4) {
          hasPointerMovedAfterOpenRef.current = true;
        }
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const interval = setInterval(() => {
      if (!isOpenRef.current) return;
      if (Date.now() < ignoreHoverUntilRef.current) {
        if (isPointerOverRef.current) {
          isPointerOverRef.current = false;
          updatePauseState();
        }
        return;
      }
      if (!hasPointerMovedAfterOpenRef.current) {
        if (isPointerOverRef.current) {
          isPointerOverRef.current = false;
          updatePauseState();
        }
        return;
      }
      const { x, y } = lastPointerPosRef.current;
      if (x < 0 || y < 0) return;
      const el = document.elementFromPoint(x, y);
      const isOver = !!photoButtonRef.current?.contains(el);
      if (isPointerOverRef.current !== isOver) {
        isPointerOverRef.current = isOver;
        updatePauseState();
      }
    }, 500);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      clearInterval(interval);
    };
  }, [updatePauseState]);

  // IntersectionObserver to pause when hero is offscreen
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isOffscreenRef.current = !entry.isIntersecting;
        updatePauseState();
      },
      { threshold: 0.05 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [updatePauseState]);

  // visibilitychange listener to pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      isHiddenRef.current = document.hidden;
      updatePauseState();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updatePauseState]);

  // Build the continuous loop timeline inside the travel box
  const buildLoopTimeline = useCallback(() => {
    const photo = photoWrapperRef.current;
    if (!photo) return null;

    if (loopTlRef.current) {
      loopTlRef.current.kill();
    }

    const isReduced =
      typeof window !== 'undefined' &&
      (isReducedMotionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const legDuration = isReduced ? 4.5 : 2.2;
    const holdDuration = isReduced ? 0.5 : 0.25;

    const stops = getTravelStops();
    gsap.set(photo, { x: stops.xc, y: stops.yc });

    const tl = gsap.timeline({
      repeat: -1,
      paused: true,
    });

    // Leg 1: center -> top-left (0, 0)
    tl.to(photo, {
      x: 0,
      y: 0,
      duration: legDuration,
      ease: 'sine.inOut',
    }, `+=${holdDuration}`);

    // Leg 2: top-left -> top-right (xr, 0)
    tl.to(photo, {
      x: () => getTravelStops().xr,
      y: 0,
      duration: legDuration,
      ease: 'sine.inOut',
    }, `+=${holdDuration}`);

    // Leg 3: top-right -> center (xc, yc)
    tl.to(photo, {
      x: () => getTravelStops().xc,
      y: () => getTravelStops().yc,
      duration: legDuration,
      ease: 'sine.inOut',
    }, `+=${holdDuration}`);

    // Leg 4: center -> bottom-right (xr, yb)
    tl.to(photo, {
      x: () => getTravelStops().xr,
      y: () => getTravelStops().yb,
      duration: legDuration,
      ease: 'sine.inOut',
    }, `+=${holdDuration}`);

    // Leg 5: bottom-right -> bottom-left (0, yb)
    tl.to(photo, {
      x: 0,
      y: () => getTravelStops().yb,
      duration: legDuration,
      ease: 'sine.inOut',
    }, `+=${holdDuration}`);

    // Leg 6: bottom-left -> center (xc, yc)
    tl.to(photo, {
      x: () => getTravelStops().xc,
      y: () => getTravelStops().yc,
      duration: legDuration,
      ease: 'sine.inOut',
    }, `+=${holdDuration}`);

    loopTlRef.current = tl;
    return tl;
  }, [getTravelStops]);

  // Open photo reveal
  const openPhoto = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e && 'clientX' in e && (e.clientX !== 0 || e.clientY !== 0)) {
      clickPointerPosRef.current = { x: e.clientX, y: e.clientY };
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      clickPointerPosRef.current = { x: -1, y: -1 };
    }
    hasPointerMovedAfterOpenRef.current = false;
    measureBox();
    gsap.killTweensOf('.hero-line');
    gsap.killTweensOf('.hero-intro');

    setIsOpen(true);
    isOpenRef.current = true;
    setIsManualPaused(false);
    isManualPausedRef.current = false;
    ignoreHoverUntilRef.current = Date.now() + 800;
    isPointerOverRef.current = false;
    isPointerDownRef.current = false;
    isFocusedRef.current = false;

    if (showHint) {
      setShowHint(false);
      try {
        localStorage.setItem('portfolio-hero-hint-dismissed', 'true');
      } catch {}
    }

    const prefersReduce =
      typeof window !== 'undefined' &&
      (isReducedMotionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const isMobile = window.innerWidth < 768;
    const stops = getTravelStops();

    if (prefersReduce) {
      if (headingWrapperRef.current) {
        headingWrapperRef.current.style.visibility = 'hidden';
      }
      if (photoWrapperRef.current && circleRef.current && imageInnerRef.current) {
        photoWrapperRef.current.style.display = 'block';
        gsap.set(photoWrapperRef.current, { x: stops.xc, y: stops.yc });
        circleRef.current.style.clipPath = 'none';
        imageInnerRef.current.style.transform = 'none';
      }
      if (isMobile && travelBoxRef.current) {
        travelBoxRef.current.style.height = '280px';
      }
      ScrollTrigger.refresh();

      ignoreHoverUntilRef.current = Date.now() + 800;
      isPointerOverRef.current = false;

      const loop = buildLoopTimeline();
      if (loop) {
        loop.play();
        updatePauseState();
      }
      return;
    }

    gsap.context(() => {
      // Ensure photo wrapper is at center before reveal
      if (photoWrapperRef.current) {
        gsap.set(photoWrapperRef.current, { display: 'block', x: stops.xc, y: stops.yc });
      }

      const openTl = gsap.timeline({
        onComplete: () => {
          if (headingWrapperRef.current) {
            headingWrapperRef.current.style.visibility = 'hidden';
          }
          if (circleRef.current) {
            gsap.set(circleRef.current, { clearProps: 'clipPath' });
          }
          ScrollTrigger.refresh();

          ignoreHoverUntilRef.current = Date.now() + 800;
          isPointerOverRef.current = false;

          const loop = buildLoopTimeline();
          if (loop) {
            loop.play();
            updatePauseState();
          }
        },
      });

      // Mobile: Expand travel box from name block height to 280px
      if (isMobile && travelBoxRef.current) {
        const startH = boxDimensionsRef.current.closedHeight;
        openTl.fromTo(
          travelBoxRef.current,
          { height: startH },
          { height: 280, duration: 0.6, ease: 'expo.out' },
          0
        );
      }

      // Step 1: Slide name lines up behind their mask (yPercent 0 to -110, 0.6s, expo.out, stagger 0.06)
      openTl.to('.hero-line', {
        yPercent: -110,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.06,
      }, 0);

      // Step 2: Reveal circle photo at center of the box (0.8s expo.out)
      if (circleRef.current) {
        openTl.fromTo(
          circleRef.current,
          { clipPath: 'circle(0% at 50% 50%)' },
          { clipPath: 'circle(50% at 50% 50%)', duration: 0.8, ease: 'expo.out' },
          '>-0.4'
        );
      }

      if (imageInnerRef.current) {
        openTl.fromTo(
          imageInnerRef.current,
          { scale: 1.08 },
          { scale: 1.0, duration: 0.8, ease: 'expo.out' },
          '<'
        );
      }
    }, heroRef);
  }, [showHint, measureBox, getTravelStops, buildLoopTimeline, updatePauseState]);

  // Close photo and return name
  const closePhoto = useCallback(() => {
    // Stop the loop timeline immediately where it is
    if (loopTlRef.current) {
      loopTlRef.current.pause();
      loopTlRef.current.kill();
      loopTlRef.current = null;
    }

    setIsOpen(false);
    isOpenRef.current = false;
    setIsManualPaused(false);
    isManualPausedRef.current = false;
    isPointerOverRef.current = false;
    isFocusedRef.current = false;
    isPointerDownRef.current = false;

    const isReduced =
      typeof window !== 'undefined' &&
      (isReducedMotionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const isMobile = window.innerWidth < 768;

    if (isReduced) {
      if (photoWrapperRef.current) {
        photoWrapperRef.current.style.display = 'none';
      }
      if (headingWrapperRef.current) {
        headingWrapperRef.current.style.visibility = 'visible';
      }
      if (isMobile && travelBoxRef.current) {
        travelBoxRef.current.style.height = '';
      }
      ScrollTrigger.refresh();
      nameButtonRef.current?.focus();
      return;
    }

    gsap.context(() => {
      if (headingWrapperRef.current) {
        headingWrapperRef.current.style.visibility = 'visible';
      }

      const closeTl = gsap.timeline({
        onComplete: () => {
          if (photoWrapperRef.current) {
            photoWrapperRef.current.style.display = 'none';
          }
          if (isMobile && travelBoxRef.current) {
            travelBoxRef.current.style.height = '';
          }
          ScrollTrigger.refresh();
          nameButtonRef.current?.focus();
        },
      });

      // 1. Close photo with circular clip-path to circle(0%) (0.5s) where it is
      if (circleRef.current) {
        closeTl.fromTo(
          circleRef.current,
          { clipPath: 'circle(50% at 50% 50%)' },
          { clipPath: 'circle(0% at 50% 50%)', duration: 0.5, ease: 'power2.in' },
          0
        );
      }

      // Mobile: shrink travel box back to name block height
      if (isMobile && travelBoxRef.current) {
        const targetH = boxDimensionsRef.current.closedHeight;
        closeTl.to(
          travelBoxRef.current,
          { height: targetH, duration: 0.5, ease: 'power2.in', clearProps: 'height' },
          0
        );
      }

      // 2. Slide name lines back in from below (yPercent 110 to 0, 1.1s, expo.out, stagger 0.12)
      closeTl.fromTo(
        '.hero-line',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.12,
          clearProps: 'transform',
        },
        0.35
      );
    }, heroRef);
  }, []);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closePhoto]);

  // Pointer event listeners on photo
  const handlePhotoPointerEnter = () => {
    if (Date.now() < ignoreHoverUntilRef.current) return;
    if (!hasPointerMovedAfterOpenRef.current) return;
    isPointerOverRef.current = true;
    updatePauseState();
  };

  const handlePhotoPointerLeave = () => {
    isPointerOverRef.current = false;
    updatePauseState();
  };

  const handlePhotoPointerDown = () => {
    isPointerDownRef.current = true;
    updatePauseState();
  };

  const handlePhotoPointerUp = () => {
    isPointerDownRef.current = false;
    updatePauseState();
  };

  // Focus event listeners on photo & control line (pause only on KEYBOARD focus)
  const handleFocusIn = (e: React.FocusEvent) => {
    if (e.target.matches?.(':focus-visible')) {
      isFocusedRef.current = true;
      updatePauseState();
    }
  };

  const handleFocusOut = () => {
    isFocusedRef.current = false;
    updatePauseState();
  };

  // Toggle manual movement pause
  const toggleManualPause = () => {
    setIsManualPaused((prev) => {
      const next = !prev;
      isManualPausedRef.current = next;
      updatePauseState();
      return next;
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative pt-20 sm:pt-24 md:pt-28 pb-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 md:px-10"
    >
      <div className="flex flex-col relative">
        {/* Click hint (sentence case, JetBrains Mono, muted, dismissed permanently after first open) */}
        {showHint && (
          <p className="font-mono text-xs text-mute mb-2 select-none">
            Click my name
          </p>
        )}

        {/* TRAVEL BOX:
            Desktop: exact bounding box of the two-line name block in its closed state (reused space, zero layout shift)
            Mobile: text-column width by 280px tall when open, expands and shrinks smoothly
        */}
        <div
          id="hero-photo-travel-box"
          ref={travelBoxRef}
          className="relative select-none w-fit"
        >
          {/* NAME HEADING CONTAINER */}
          <div
            ref={headingWrapperRef}
            className="w-fit"
          >
            <h1 className="font-serif text-[clamp(3.5rem,16vw,13rem)] leading-[0.88] tracking-[-0.03em] text-ink select-none font-normal">
              <button
                type="button"
                ref={nameButtonRef}
                onClick={openPhoto}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPhoto();
                  }
                }}
                aria-expanded={isOpen}
                aria-controls="hero-photo-travel-box"
                aria-hidden={isOpen ? 'true' : undefined}
                tabIndex={isOpen ? -1 : 0}
                className="group/name text-left block w-fit p-0 m-0 bg-transparent border-0 text-inherit font-inherit leading-inherit tracking-inherit cursor-pointer rounded-none focus:outline-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
              >
                <span className="sr-only">Balaji Dasetti, show my photo</span>
                <span aria-hidden="true" className="block">
                  {/* pb-[0.2em] -mb-[0.2em] on line 1 prevents clipping 'j' descender without altering line spacing */}
                  <span className="block overflow-hidden pb-[0.2em] -mb-[0.2em]">
                    <span className="block hero-line will-change-transform">Balaji</span>
                  </span>
                  <span className="block overflow-hidden pb-[0.2em]">
                    <span className="block hero-line will-change-transform">Dasetti</span>
                  </span>
                </span>
              </button>
            </h1>
          </div>

          {/* TRAVELING PHOTO:
              In its own layer sitting above name lines, not clipped by the overflow hidden masks.
              Moved strictly via GSAP x and y transforms inside the name-block box.
          */}
          <div
            id="hero-traveling-photo"
            ref={photoWrapperRef}
            className="absolute top-0 left-0 z-20 will-change-transform"
            style={{ display: isOpen ? 'block' : 'none' }}
            onPointerEnter={handlePhotoPointerEnter}
            onPointerLeave={handlePhotoPointerLeave}
            onPointerDown={handlePhotoPointerDown}
            onPointerUp={handlePhotoPointerUp}
            onPointerCancel={handlePhotoPointerUp}
            onFocus={handleFocusIn}
            onBlur={handleFocusOut}
          >
            {/* 12px invisible hit area around photo button via after pseudo-element */}
            <button
              id="hero-photo-button"
              type="button"
              ref={photoButtonRef}
              onClick={closePhoto}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  closePhoto();
                }
              }}
              aria-label="Hide my photo and show my name"
              className="p-0 m-0 border-0 bg-transparent rounded-full block cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 relative after:absolute after:-inset-3 after:content-['']"
              title="Click to hide photo and show name"
            >
              {/* Perfect circle wrapper: 110px on mobile, clamp(150px, 15vw, 210px) on desktop (<= 45% of width/height) */}
              <div
                id="hero-photo-circle"
                ref={circleRef}
                style={{ width: `${boxDimensionsRef.current.d}px`, height: `${boxDimensionsRef.current.d}px` }}
                className="aspect-square rounded-full border border-line bg-white relative overflow-hidden"
              >
                <div
                  ref={imageInnerRef}
                  className="w-full h-full rounded-full overflow-hidden will-change-transform"
                >
                  {hasImageError ? (
                    <div className="w-full h-full rounded-full border border-line bg-white flex items-center justify-center text-mute text-xs font-mono">
                      Photo placeholder
                    </div>
                  ) : (
                    <Image
                      src="/me.webp"
                      alt="Balaji Dasetti"
                      width={800}
                      height={800}
                      sizes="(min-width: 1024px) 210px, (min-width: 768px) 180px, 110px"
                      className="w-full h-full object-cover object-center"
                      onError={() => setHasImageError(true)}
                      priority={false}
                    />
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* CONTROL LINE:
            Directly below the travel box, left aligned, in space reserved in advance (h-8 mt-4), zero layout shift
        */}
        <div
          id="hero-control-line"
          ref={controlLineRef}
          onFocus={handleFocusIn}
          onBlur={handleFocusOut}
          aria-hidden={!isOpen}
          className={`mt-4 h-8 flex items-center gap-6 font-mono text-[0.85rem] text-mute select-none transition-opacity duration-300 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={toggleManualPause}
            aria-pressed={isManualPaused}
            tabIndex={isOpen ? 0 : -1}
            className="bg-transparent border-0 p-0 text-inherit font-inherit cursor-pointer hover:text-ink hover:underline hover:decoration-accent decoration-2 underline-offset-4 focus:outline-none focus-visible:outline-2 focus-visible:outline-accent"
          >
            {isManualPaused ? 'Resume movement' : 'Pause movement'}
          </button>

          <button
            type="button"
            onClick={closePhoto}
            tabIndex={isOpen ? 0 : -1}
            className="bg-transparent border-0 p-0 text-inherit font-inherit cursor-pointer hover:text-ink hover:underline hover:decoration-accent decoration-2 underline-offset-4 focus:outline-none focus-visible:outline-2 focus-visible:outline-accent"
          >
            Show my name
          </button>
        </div>

        {/* HERO INTRO: Positioned below travel box and control line */}
        <div className="mt-8 sm:mt-10 md:mt-14 md:ml-auto md:w-3/5 lg:w-1/2">
          <p className="hero-intro text-lg sm:text-xl text-mute leading-relaxed max-w-[65ch]">
            I build the PHP and MySQL backend and the Flutter application on top of it, then deploy it on AWS and ship it to the app stores. Currently working on VStay, a college accommodation platform, at VianaSoft in Chennai.
          </p>
        </div>
      </div>
    </section>
  );
}
