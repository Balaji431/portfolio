'use client';

import React, { useEffect, useRef } from 'react';

// ============================================================================
// TUNABLE CONSTANTS
// ============================================================================
const SPEED = 0.3;          // 1 = normal drift, 0.5 = half, 0.3 = slow and calm, 0.25 = very slow
const COUNT_DESKTOP = 55;   // width >= 1024px
const COUNT_TABLET = 35;    // 768-1023px
const COUNT_MOBILE = 22;    // below 768px
const LINK_DIST_DESKTOP = 150;
const LINK_DIST_MOBILE = 110;
const TRAIL_FADE = 0.10;    // 0.08-0.15; higher = shorter trails

// Motion & sketchy pencil-stroke parameters
const BASE_SPEED_MIN = 0.3; // Base speed min (px per 60fps frame before * SPEED)
const BASE_SPEED_MAX = 0.8; // Base speed max (px per 60fps frame before * SPEED)
const WOBBLE_AMPLITUDE = 0.12; // Base wobble amplitude (multiplied by SPEED)
const WOBBLE_FREQ_BASE = 0.0025; // Base wobble angular frequency in rad/ms (multiplied by SPEED)
const FULL_CLEAR_INTERVAL_FRAMES = 600; // Periodic full clear to prevent permanent ghost smudges

// Opacity & geometry constants
const LINE_MIN_WIDTH = 0.5;
const LINE_MAX_WIDTH = 1.1;
const LINE_MIN_OPACITY = 0.10;
const LINE_MAX_OPACITY = 0.22;
const LINE_CENTER_CAP_OPACITY = 0.12; // Never exceed 12% behind body paragraphs

const DOT_MIN_RADIUS = 1.2;
const DOT_MAX_RADIUS = 2.2;
const PRIMARY_DOT_MIN_OPACITY = 0.35;
const PRIMARY_DOT_MAX_OPACITY = 0.55;
const TAUPE_DOT_OPACITY = 0.50;
const TAUPE_DOT_RATIO = 0.20; // ~1 in 5 dots in Muted Taupe

const TRIANGLE_FILL_OPACITY = 0.025; // 2-3% effective triangle fill opacity (Butter Yellow at 8-12% scaled by proximity)
const RESIZE_DEBOUNCE_MS = 150;
// ============================================================================

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ThemeColors {
  bg: RGB;
  primaryDot: RGB;
  taupeDot: RGB;
  line: RGB;
  triangleFill: RGB;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isTaupe: boolean;
  baseAlpha: number;
  phase: number;
  wobbleFreq: number;
  strokeSeed: number;
}

function parseHexToRgb(hex: string, fallback: RGB): RGB {
  const clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return { r, g, b };
    }
  } else if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return { r, g, b };
    }
  }
  return fallback;
}

function readThemeColorsFromCss(): ThemeColors {
  const defaultIvory: RGB = { r: 247, g: 244, b: 236 };  // #F7F4EC
  const defaultDarkBg: RGB = { r: 34, g: 41, b: 26 };    // #22291A
  const defaultOlive: RGB = { r: 82, g: 97, b: 58 };     // #52613A
  const defaultTaupe: RGB = { r: 169, g: 154, b: 126 };  // #A99A7E
  const defaultButter: RGB = { r: 244, g: 232, b: 168 }; // #F4E8A8

  if (typeof window === 'undefined') {
    return {
      bg: defaultIvory,
      primaryDot: defaultOlive,
      taupeDot: defaultTaupe,
      line: defaultOlive,
      triangleFill: defaultButter,
    };
  }

  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  const styles = getComputedStyle(root);

  const bgHex = styles.getPropertyValue('--bg') || (isDark ? '#22291A' : '#F7F4EC');
  const oliveHex = styles.getPropertyValue('--olive') || '#52613A';
  const taupeHex = styles.getPropertyValue('--taupe') || '#A99A7E';
  const butterHex = styles.getPropertyValue('--butter') || '#F4E8A8';
  const accentHex = styles.getPropertyValue('--accent') || (isDark ? '#F4E8A8' : '#52613A');
  const inkHex = styles.getPropertyValue('--ink') || (isDark ? '#F7F4EC' : '#2E3820');

  if (isDark) {
    return {
      bg: parseHexToRgb(bgHex, defaultDarkBg),
      primaryDot: parseHexToRgb(inkHex, defaultIvory),
      taupeDot: parseHexToRgb(taupeHex, defaultTaupe),
      line: parseHexToRgb(accentHex, defaultButter),
      triangleFill: parseHexToRgb(accentHex, defaultButter),
    };
  }

  return {
    bg: parseHexToRgb(bgHex, defaultIvory),
    primaryDot: parseHexToRgb(oliveHex, defaultOlive),
    taupeDot: parseHexToRgb(taupeHex, defaultTaupe),
    line: parseHexToRgb(oliveHex, defaultOlive),
    triangleFill: parseHexToRgb(butterHex, defaultButter),
  };
}

/**
 * Attenuates particle and line opacity near the horizontal reading column
 * so lines behind body paragraphs never exceed 12% opacity.
 */
function getReadingZoneFactor(x: number, width: number): number {
  if (width <= 0) return 1;
  const nx = Math.abs(x / width - 0.5) * 2; // 0 at horizontal centre, 1 at viewport edges
  if (nx >= 0.68) return 1;
  const t = nx / 0.68;
  const smooth = t * t * (3 - 2 * t);
  const minRatio = LINE_CENTER_CAP_OPACITY / LINE_MAX_OPACITY; // ~0.545
  return minRatio + (1 - minRatio) * smooth;
}

export function PlexusBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles: Particle[] = [];
    let allowTriangles = true;
    let maxLinkDist = LINK_DIST_DESKTOP;
    let maxLinkDistSq = maxLinkDist * maxLinkDist;

    let themeColors: ThemeColors = readThemeColorsFromCss();
    let rafId: number | null = null;
    let lastTime = performance.now();
    let frameCounter = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = reducedMotionQuery.matches;
    const REDUCED_MOTION_SPEED_FACTOR = 0.85; // Keep gentle movement even when OS 'Animation effects' is off

    const isLowPowerOrTouch = (): boolean => {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const lowCores =
        typeof navigator !== 'undefined' &&
        typeof navigator.hardwareConcurrency === 'number' &&
        navigator.hardwareConcurrency <= 4;
      return coarse || lowCores;
    };

    const getTargetCount = (w: number): number => {
      if (w < 768 || isLowPowerOrTouch()) {
        return COUNT_MOBILE;
      }
      if (w < 1024) {
        return COUNT_TABLET;
      }
      return COUNT_DESKTOP;
    };

    const createParticle = (w: number, h: number, index: number): Particle => {
      const angle = Math.random() * Math.PI * 2;
      // Base speed 0.3-0.8 px per frame at 60fps, multiplied by SPEED (0.3)
      const baseSpeed =
        BASE_SPEED_MIN + Math.random() * (BASE_SPEED_MAX - BASE_SPEED_MIN);
      const speed = baseSpeed * SPEED;

      const isTaupe = index % Math.round(1 / TAUPE_DOT_RATIO) === 0;
      const baseAlpha = isTaupe
        ? TAUPE_DOT_OPACITY
        : PRIMARY_DOT_MIN_OPACITY +
          Math.random() * (PRIMARY_DOT_MAX_OPACITY - PRIMARY_DOT_MIN_OPACITY);

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: DOT_MIN_RADIUS + Math.random() * (DOT_MAX_RADIUS - DOT_MIN_RADIUS),
        isTaupe,
        baseAlpha,
        phase: Math.random() * Math.PI * 2,
        // Wobble frequency also multiplied by SPEED
        wobbleFreq: WOBBLE_FREQ_BASE * SPEED * (0.8 + Math.random() * 0.4),
        strokeSeed: (index * 0.61803398875) % 1,
      };
    };

    const fullClearCanvas = () => {
      const { bg } = themeColors;
      ctx.fillStyle = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
      ctx.fillRect(0, 0, width, height);
    };

    const configureCanvasSize = (preserveExisting: boolean) => {
      const prevW = width;
      const prevH = height;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const lowPower = isLowPowerOrTouch();
      const isMobile = width < 768;
      // Triangles enabled on desktop and tablet only (skipped on mobile / touch / low-power)
      allowTriangles = !isMobile && !lowPower;
      maxLinkDist = isMobile ? LINK_DIST_MOBILE : LINK_DIST_DESKTOP;
      maxLinkDistSq = maxLinkDist * maxLinkDist;

      const targetCount = getTargetCount(width);

      if (!preserveExisting || particles.length === 0) {
        particles = Array.from({ length: targetCount }, (_, i) =>
          createParticle(width, height, i)
        );
      } else {
        const scaleX = prevW > 0 ? width / prevW : 1;
        const scaleY = prevH > 0 ? height / prevH : 1;
        for (let i = 0; i < particles.length; i++) {
          particles[i].x = Math.min(width, Math.max(0, particles[i].x * scaleX));
          particles[i].y = Math.min(height, Math.max(0, particles[i].y * scaleY));
        }
        if (particles.length < targetCount) {
          for (let i = particles.length; i < targetCount; i++) {
            particles.push(createParticle(width, height, i));
          }
        } else if (particles.length > targetCount) {
          particles.length = targetCount;
        }
      }

      fullClearCanvas();
    };

    const updateParticles = (dtMs: number, now: number) => {
      // Delta time in ms since last frame, capped at 50ms, normalized to 60fps (16.667ms)
      const clampedDt = Math.min(Math.max(dtMs, 0), 50);
      const motionMult = isReducedMotion ? REDUCED_MOTION_SPEED_FACTOR : 1;
      const frameScale = (clampedDt / 16.667) * motionMult;
      const wobbleStep = WOBBLE_AMPLITUDE * SPEED * motionMult;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const wobbleAngle = now * p.wobbleFreq + p.phase;
        const wx = Math.cos(wobbleAngle) * wobbleStep;
        const wy = Math.sin(wobbleAngle) * wobbleStep;

        p.x += (p.vx + wx) * frameScale;
        p.y += (p.vy + wy) * frameScale;

        // Softly bounce at canvas edges so there are no sudden jumps
        if (p.x <= 0) {
          p.x = 0;
          p.vx = Math.abs(p.vx);
        } else if (p.x >= width) {
          p.x = width;
          p.vx = -Math.abs(p.vx);
        }

        if (p.y <= 0) {
          p.y = 0;
          p.vy = Math.abs(p.vy);
        } else if (p.y >= height) {
          p.y = height;
          p.vy = -Math.abs(p.vy);
        }
      }
    };

    const drawFrame = (isStaticFrame: boolean, dtMs: number) => {
      const { bg, primaryDot, taupeDot, line, triangleFill } = themeColors;

      if (isStaticFrame) {
        fullClearCanvas();
      } else {
        frameCounter += 1;
        if (frameCounter >= FULL_CLEAR_INTERVAL_FRAMES) {
          // Periodic full clear every ~600 frames to prevent permanent 8-bit alpha rounding smudges,
          // followed by normal ghost-trail rendering
          frameCounter = 0;
          ctx.fillStyle = `rgba(${bg.r}, ${bg.g}, ${bg.b}, 0.35)`;
          ctx.fillRect(0, 0, width, height);
        } else {
          // Ghost trail fade scaled by delta time and SPEED so trail timing matches movement speed
          const clampedDt = Math.min(Math.max(dtMs, 8), 50);
          const frameScale = clampedDt / 16.667;
          const speedScaledFade = Math.max(
            0.08,
            Math.min(0.18, TRAIL_FADE * Math.max(0.8, SPEED / 0.3) * frameScale)
          );
          ctx.fillStyle = `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${speedScaledFade.toFixed(3)})`;
          ctx.fillRect(0, 0, width, height);
        }
      }

      const n = particles.length;

      // 1. Triangles (desktop & tablet only): fill mutually connected 3-particle triangles
      if (allowTriangles) {
        for (let i = 0; i < n; i++) {
          const pi = particles[i];
          for (let j = i + 1; j < n; j++) {
            const pj = particles[j];
            const dxIJ = pi.x - pj.x;
            const dyIJ = pi.y - pj.y;
            const distSqIJ = dxIJ * dxIJ + dyIJ * dyIJ;
            if (distSqIJ >= maxLinkDistSq) continue;

            for (let k = j + 1; k < n; k++) {
              const pk = particles[k];
              const dxIK = pi.x - pk.x;
              const dyIK = pi.y - pk.y;
              const distSqIK = dxIK * dxIK + dyIK * dyIK;
              if (distSqIK >= maxLinkDistSq) continue;

              const dxJK = pj.x - pk.x;
              const dyJK = pj.y - pk.y;
              const distSqJK = dxJK * dxJK + dyJK * dyJK;
              if (distSqJK >= maxLinkDistSq) continue;

              const maxEdgeSq = Math.max(distSqIJ, distSqIK, distSqJK);
              const proximity = 1 - Math.sqrt(maxEdgeSq) / maxLinkDist;
              const cx = (pi.x + pj.x + pk.x) / 3;
              const zoneFactor = getReadingZoneFactor(cx, width);

              const triAlpha = TRIANGLE_FILL_OPACITY * proximity * zoneFactor;
              if (triAlpha <= 0.002) continue;

              ctx.fillStyle = `rgba(${triangleFill.r}, ${triangleFill.g}, ${triangleFill.b}, ${triAlpha.toFixed(4)})`;
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.lineTo(pk.x, pk.y);
              ctx.closePath();
              ctx.fill();
            }
          }
        }
      }

      // 2. Pencil-sketched connection lines (varied width 0.5-1.1px and opacity 10-22% fading with distance)
      for (let i = 0; i < n; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < n; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= maxLinkDistSq) continue;

          const dist = Math.sqrt(distSq);
          const proximity = 1 - dist / maxLinkDist;

          // Deterministic per-pair sketchy variation for width (0.5-1.1px) and max darkness (10-22%)
          const pairHash = (pi.strokeSeed + pj.strokeSeed * 1.37) % 1;
          const lineWidth =
            LINE_MIN_WIDTH + pairHash * (LINE_MAX_WIDTH - LINE_MIN_WIDTH);
          const pairPeakOpacity =
            LINE_MIN_OPACITY +
            ((pairHash * 1.73) % 1) * (LINE_MAX_OPACITY - LINE_MIN_OPACITY);

          const mx = (pi.x + pj.x) * 0.5;
          const zoneFactor = getReadingZoneFactor(mx, width);

          const rawAlpha = pairPeakOpacity * proximity * zoneFactor;
          // Enforce strict <= 12% cap behind central body-text columns
          const maxCap =
            zoneFactor < 0.78 ? LINE_CENTER_CAP_OPACITY : LINE_MAX_OPACITY;
          const lineAlpha = Math.min(maxCap, rawAlpha);

          if (lineAlpha <= 0.004) continue;

          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = `rgba(${line.r}, ${line.g}, ${line.b}, ${lineAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.stroke();
        }
      }

      // 3. Particle dots (radius 1.2-2.2px, Olive 35-55%, 1 in 5 Taupe 50%)
      for (let i = 0; i < n; i++) {
        const p = particles[i];
        const zoneFactor = getReadingZoneFactor(p.x, width);
        const dotAlpha = p.baseAlpha * (0.65 + 0.35 * zoneFactor);
        const color = p.isTaupe ? taupeDot : primaryDot;

        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${dotAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      if (document.hidden) {
        rafId = null;
        return;
      }
      const dt = now - lastTime;
      lastTime = now;

      updateParticles(dt, now);
      drawFrame(false, dt);

      rafId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (document.hidden) return;
      if (rafId === null) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // Initial setup
    configureCanvasSize(false);
    drawFrame(true, 16.67);
    startLoop();

    // Debounced window resize (~150ms)
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        configureCanvasSize(true);
        drawFrame(true, 16.67);
      }, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Pause when tab is hidden, resume when visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Respect prefers-reduced-motion live changes
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      startLoop();
    };
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    // Watch <html class="dark"> changes: update colours and clear canvas once so no wrong-coloured trails remain
    const themeObserver = new MutationObserver(() => {
      themeColors = readThemeColorsFromCss();
      fullClearCanvas();
      drawFrame(true, 16.67);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => {
      stopLoop();
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Slow, pencil-sketched plexus / particle-network canvas with ghost trails */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* 2. Soft upper-left warm window-light wash */}
      <svg
        className="absolute inset-0 w-full h-full block pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient
            id="spring-window-light"
            cx="14%"
            cy="12%"
            r="78%"
            fx="10%"
            fy="8%"
          >
            <stop offset="0%" stopColor="var(--butter)" stopOpacity="0.14" />
            <stop offset="40%" stopColor="var(--cream)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
          </radialGradient>

          {/* Matte handmade paper grain filter (~4% opacity, fractalNoise, zero PNGs) */}
          <filter id="matte-paper-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves="4"
              stitchTiles="stitch"
              seed="19"
              result="paperNoise"
            />
            <feColorMatrix
              in="paperNoise"
              type="matrix"
              values="0 0 0 0 0.42
                      0 0 0 0 0.38
                      0 0 0 0 0.31
                      0 0 0 0.04 0"
            />
          </filter>
        </defs>
        <rect width="1440" height="900" fill="url(#spring-window-light)" />
      </svg>

      {/* 3. Soft radial readability fade (75% bg opacity at centre) behind hero name block & body columns */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 52% 68% at 50% 48%, color-mix(in srgb, var(--bg) 75%, transparent) 0%, color-mix(in srgb, var(--bg) 35%, transparent) 62%, transparent 100%)',
        }}
      />

      {/* 4. Full-viewport SVG matte paper grain overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <rect width="100%" height="100%" filter="url(#matte-paper-grain)" />
      </svg>
    </div>
  );
}
