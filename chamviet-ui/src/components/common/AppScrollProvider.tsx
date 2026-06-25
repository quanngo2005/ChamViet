import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion, useScroll, type MotionValue } from "motion/react";

type ScrollTarget = number | HTMLElement | string;

type ScrollToOptions = {
  immediate?: boolean;
  offset?: number;
};

type ScrollContextValue = {
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

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = immediate || reducedMotion ? "auto" : "smooth";

  if (typeof resolved === "number") {
    window.scrollTo({ top: resolved, behavior });
    return;
  }

  const top = resolved.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior });
}

export function scrollToSection(sectionId: string, offset = 80) {
  scrollToTarget(sectionId, { offset });
}

/**
 * Owns app-wide scroll helpers and motion values without replacing
 * native browser scrolling.
 */
export default function AppScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const location = useLocation();
  const { scrollY, scrollYProgress } = useScroll();

  const scrollTo = useCallback((target: ScrollTarget, options?: ScrollToOptions) => {
    scrollToTarget(target, options);
  }, []);

  const scrollToTop = useCallback((immediate = false) => {
    scrollToTarget(0, { immediate });
  }, []);

  useEffect(() => {
    scrollToTop(true);
  }, [location.pathname, scrollToTop]);

  const value = useMemo(
    () => ({
      prefersReducedMotion,
      scrollTo,
      scrollToTop,
      scrollY,
      scrollYProgress,
    }),
    [prefersReducedMotion, scrollTo, scrollToTop, scrollY, scrollYProgress],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}
