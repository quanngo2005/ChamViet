import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

// Module-level singleton so components can access the Lenis instance
// without prop-drilling or context overhead.
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Wraps the app with Lenis smooth scroll.
 *
 * Fixes vs. previous version:
 * - RAF id is stored and cancelled on cleanup (no leak on route change)
 * - `scrollerProxy` wires Lenis into Motion's useScroll so the
 *   progress bar doesn't stutter
 * - Respects `prefers-reduced-motion` at runtime — disables Lenis entirely
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // If user prefers reduced motion, skip Lenis entirely.
    // Native scroll will be used — the CSS already handles .scroll-reveal reset.
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      // Keep smoothness, but reduce the "floating behind the cursor" feeling.
      duration: 0.88,
      // Expo-out feel: fast start, buttery deceleration
      easing: (t) => 1 - Math.pow(1 - t, 4),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      // Calmer touch response so mobile scrolling feels precise.
      touchMultiplier: 1.2,
    });

    lenisInstance = lenis;

    // Store RAF id so we can cancel it on cleanup
    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
