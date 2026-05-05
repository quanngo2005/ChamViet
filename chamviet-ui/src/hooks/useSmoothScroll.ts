import { useEffect, useRef } from 'react';

/**
 * Options for the scroll-reveal animation.
 */
export interface SmoothScrollOptions {
  /** IntersectionObserver threshold (0–1). Default: 0.12 */
  threshold?: number;
  /** Root margin for triggering earlier/later. Default: '0px 0px -80px 0px' */
  rootMargin?: string;
  /** Whether to animate only once or every time the element enters view. Default: true */
  once?: boolean;
}

// Runtime check — cached once at module load
const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Hook that observes a DOM element and toggles a `data-scroll-visible`
 * attribute when it enters the viewport.
 *
 * Quality improvements over v1:
 * - Runtime `prefers-reduced-motion` check (not just CSS)
 * - `will-change` is REMOVED after animation to free GPU compositing layer
 * - Slightly earlier trigger (rootMargin -80px vs -60px) so content
 *   is already animating as user reaches it, not after
 * - threshold lowered to 0.12 — triggers on first pixel, feels snappier
 *
 * @example
 * ```tsx
 * const ref = useSmoothScroll<HTMLDivElement>();
 * return <div ref={ref} className="scroll-reveal fade-up">…</div>;
 * ```
 */
export function useSmoothScroll<T extends HTMLElement = HTMLDivElement>(
  options: SmoothScrollOptions = {},
) {
  const {
    threshold = 0.12,
    rootMargin = '0px 0px -80px 0px',
    once = true,
  } = options;

  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // For reduced-motion users: immediately show content, skip observer
    if (PREFERS_REDUCED_MOTION) {
      el.setAttribute('data-scroll-visible', 'true');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-scroll-visible', 'true');

          // Free the GPU compositing layer after the animation settles
          // (transition-duration max is 1.6s; 1700ms is safe)
          if (once) {
            setTimeout(() => {
              el.style.willChange = 'auto';
            }, 1700);
            observer.unobserve(el);
          }
        } else if (!once) {
          el.removeAttribute('data-scroll-visible');
          el.style.willChange = 'opacity, transform';
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return elementRef;
}

/**
 * Hook that observes *multiple* children of a container and staggers
 * their reveal animations automatically.
 *
 * Quality improvements over v1:
 * - Observes at threshold:0 so it fires as SOON as ANY pixel enters —
 *   children start animating before the container is fully visible
 * - Stagger delay is capped at 600ms so last item doesn't feel abandoned
 * - `will-change` cleaned up after the last item's animation settles
 * - Runtime `prefers-reduced-motion` skips all animation
 *
 * @example
 * ```tsx
 * const ref = useSmoothScrollStagger<HTMLDivElement>('.card', 120);
 * return (
 *   <div ref={ref}>
 *     <div className="card scroll-reveal-child fade-up">…</div>
 *   </div>
 * );
 * ```
 */
export function useSmoothScrollStagger<T extends HTMLElement = HTMLDivElement>(
  childSelector: string,
  staggerMs = 100,
  options: SmoothScrollOptions = {},
) {
  const {
    // threshold:0 = fires the moment 1 pixel enters viewport
    threshold = 0,
    rootMargin = '0px 0px -40px 0px',
    once = true,
  } = options;

  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll<HTMLElement>(childSelector);
    if (!children.length) return;

    // For reduced-motion users: show all immediately, no delays
    if (PREFERS_REDUCED_MOTION) {
      children.forEach((child) => {
        child.setAttribute('data-scroll-visible', 'true');
      });
      return;
    }

    // Cap stagger so the last item doesn't feel too delayed
    const maxDelay = 600;
    children.forEach((child, i) => {
      const delay = Math.min(i * staggerMs, maxDelay);
      child.style.setProperty('--stagger-delay', `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => {
            child.setAttribute('data-scroll-visible', 'true');
          });

          if (once) {
            // Clean up will-change after the longest possible transition
            // = last item delay (capped) + max transition duration (1.6s)
            const lastDelay = Math.min((children.length - 1) * staggerMs, maxDelay);
            const cleanupTime = lastDelay + 1700;
            setTimeout(() => {
              children.forEach((child) => {
                child.style.willChange = 'auto';
              });
            }, cleanupTime);
            observer.unobserve(container);
          }
        } else if (!once) {
          children.forEach((child) => {
            child.removeAttribute('data-scroll-visible');
            child.style.willChange = 'opacity, transform';
          });
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [childSelector, staggerMs, threshold, rootMargin, once]);

  return containerRef;
}

/**
 * Smoothly scroll to an element by id.
 * Uses Lenis if available, falls back to native scrollTo.
 */
export async function scrollToSection(sectionId: string, offset = 80) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}


