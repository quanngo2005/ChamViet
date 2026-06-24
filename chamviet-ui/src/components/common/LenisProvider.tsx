import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion, useScroll, type MotionValue } from "motion/react";
import Lenis from "lenis";

// Module-level singleton so components can access the Lenis instance
// without prop-drilling or context overhead.
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

type ScrollTarget = number | HTMLElement | string;

type ScrollToOptions = {
  immediate?: boolean;
  offset?: number;
};

type ScrollContextValue = {
  lenis: Lenis | null;
  prefersReducedMotion: boolean;
  scrollTo: (target: ScrollTarget, options?: ScrollToOptions) => void;
  scrollToTop: (immediate?: boolean) => void;
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
};

export const ScrollContext = createContext<ScrollContextValue | null>(null);

function resolveScrollTarget(target: ScrollTarget): HTMLElement | number | null {
  if (typeof target === "number") return target;
  if (typeof target === "string") {
    if (target.startsWith("#")) {
      return document.querySelector<HTMLElement>(target);
    }

    return document.getElementById(target);
  }

  return target;
}

export function scrollToTarget(target: ScrollTarget, options: ScrollToOptions = {}) {
  const { immediate = false, offset = 0 } = options;
  const resolved = resolveScrollTarget(target);

  if (resolved == null) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(resolved, { immediate, offset: -offset });
    return;
  }

  if (typeof resolved === "number") {
    window.scrollTo({ top: resolved, behavior: immediate ? "auto" : "smooth" });
    return;
  }

  const top = resolved.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}

export function scrollToSection(sectionId: string, offset = 80) {
  scrollToTarget(sectionId, { offset });
}

/**
 * Wraps the app with Lenis smooth scroll.
 *
 * Owns the app-wide scroll engine so visual components can subscribe
 * to shared motion values instead of attaching their own scroll listeners.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  const scrollTo = useCallback((target: ScrollTarget, options?: ScrollToOptions) => {
    scrollToTarget(target, options);
  }, []);

  const scrollToTop = useCallback((immediate = false) => {
    scrollToTarget(0, { immediate });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const touchMedia = window.matchMedia("(hover: none), (pointer: coarse)");

    const updateTouchDevice = () => {
      setIsTouchDevice(touchMedia.matches || navigator.maxTouchPoints > 0);
    };

    updateTouchDevice();
    if (typeof touchMedia.addEventListener === "function") {
      touchMedia.addEventListener("change", updateTouchDevice);
    } else {
      touchMedia.addListener(updateTouchDevice);
    }

    return () => {
      if (typeof touchMedia.removeEventListener === "function") {
        touchMedia.removeEventListener("change", updateTouchDevice);
      } else {
        touchMedia.removeListener(updateTouchDevice);
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) {
      lenisRef.current = null;
      lenisInstance = null;
      setLenis(null);
      return;
    }

    const lenis = new Lenis({
      duration: 0.72,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;
    setLenis(lenis);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      lenisInstance = null;
      setLenis(null);
    };
  }, [isTouchDevice, prefersReducedMotion]);

  useEffect(() => {
    scrollToTop(true);
  }, [location.pathname, scrollToTop]);

  const value = useMemo(
    () => ({
      lenis,
      prefersReducedMotion,
      scrollTo,
      scrollToTop,
      scrollY,
      scrollYProgress,
    }),
    [lenis, prefersReducedMotion, scrollTo, scrollToTop, scrollY, scrollYProgress],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}
