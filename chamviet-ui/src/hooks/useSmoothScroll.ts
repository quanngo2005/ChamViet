import { useEffect, useRef } from 'react';

/**
 * Options for the scroll-reveal animation.
 */
export interface SmoothScrollOptions {
  /** IntersectionObserver threshold (0–1). Default: 0.15 */
  threshold?: number;
  /** Root margin for triggering earlier/later. Default: '0px 0px -60px 0px' */
  rootMargin?: string;
  /** Whether to animate only once or every time the element enters view. Default: true */
  once?: boolean;
}

/**
 * Hook that observes a DOM element and toggles a `data-scroll-visible`
 * attribute when it enters the viewport.
 *
 * Pair this with the CSS classes in `smooth-scroll.css` for the actual
 * transition (fade-up, fade-left, fade-right, scale-in, etc.).
 *
 * @example
 * ```tsx
 * function MySection() {
 *   const ref = useSmoothScroll<HTMLDivElement>();
 *   return <div ref={ref} className="scroll-reveal fade-up">…</div>;
 * }
 * ```
 */
export function useSmoothScroll<T extends HTMLElement = HTMLDivElement>(
  options: SmoothScrollOptions = {},
) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -60px 0px',
    once = true,
  } = options;

  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-scroll-visible', 'true');
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.removeAttribute('data-scroll-visible');
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
 * Each child gets a CSS custom property `--stagger-delay` set to
 * `index * staggerMs` so CSS can pick it up via `transition-delay`.
 *
 * @example
 * ```tsx
 * function CardGrid() {
 *   const containerRef = useSmoothScrollStagger<HTMLDivElement>('.card', 120);
 *   return (
 *     <div ref={containerRef} className="scroll-reveal-container">
 *       <div className="card scroll-reveal fade-up">…</div>
 *       <div className="card scroll-reveal fade-up">…</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSmoothScrollStagger<T extends HTMLElement = HTMLDivElement>(
  childSelector: string,
  staggerMs = 100,
  options: SmoothScrollOptions = {},
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -40px 0px',
    once = true,
  } = options;

  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll<HTMLElement>(childSelector);
    if (!children.length) return;

    // Assign stagger delays
    children.forEach((child, i) => {
      child.style.setProperty('--stagger-delay', `${i * staggerMs}ms`);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => {
            child.setAttribute('data-scroll-visible', 'true');
          });
          if (once) observer.unobserve(container);
        } else if (!once) {
          children.forEach((child) => {
            child.removeAttribute('data-scroll-visible');
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
 * Smoothly scroll to an element by id with an optional offset.
 */
export function scrollToSection(sectionId: string, offset = 80) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
