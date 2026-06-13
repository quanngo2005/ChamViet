import type { CSSProperties, ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";

type RevealTag = "article" | "div" | "figure" | "section" | "span";
type RevealVariant = "left" | "right" | "scale" | "up";

type SharedProps = {
  as?: RevealTag;
  children: ReactNode;
  className?: string;
  id?: string;
  once?: boolean;
  amount?: number;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
  variant?: RevealVariant;
  [key: string]: unknown;
};

const motionMap = {
  article: motion.article,
  div: motion.div,
  figure: motion.figure,
  section: motion.section,
  span: motion.span,
} as const;

function createRevealVariants(
  variant: RevealVariant,
  duration: number,
  delay = 0,
): Variants {
  const axisMap = {
    left: { x: 20, y: 0, scale: 1 },
    right: { x: -20, y: 0, scale: 1 },
    scale: { x: 0, y: 0, scale: 0.97 },
    up: { x: 0, y: 20, scale: 1 },
  } satisfies Record<RevealVariant, { x: number; y: number; scale: number }>;

  const hidden = axisMap[variant];

  return {
    hidden: {
      opacity: 0,
      x: hidden.x,
      y: hidden.y,
      scale: hidden.scale,
      filter: variant === "scale" ? "blur(1px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      } satisfies Transition,
    },
  };
}

export function Reveal({
  amount = 0.16,
  as = "div",
  children,
  delay = 0,
  duration = 0.45,
  once = true,
  style,
  variant = "up",
  ...rest
}: SharedProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = motionMap[as];
  const variants = createRevealVariants(variant, duration, delay);

  return (
    <MotionComponent
      initial={prefersReducedMotion ? false : "hidden"}
      style={style}
      variants={variants}
      viewport={{ amount, once }}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}

export function StaggerReveal({
  amount = 0.1,
  as = "div",
  children,
  className,
  once = true,
  style,
  ...rest
}: SharedProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = motionMap[as];

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  return (
    <MotionComponent
      className={className}
      initial={prefersReducedMotion ? false : "hidden"}
      style={style}
      variants={variants}
      viewport={{ amount, once }}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}

export function RevealItem({
  amount = 0.1,
  as = "div",
  children,
  delay = 0,
  duration = 0.42,
  once = true,
  style,
  variant = "up",
  ...rest
}: SharedProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = motionMap[as];
  const variants = createRevealVariants(variant, duration, delay);

  return (
    <MotionComponent
      style={style}
      variants={prefersReducedMotion ? undefined : variants}
      viewport={{ amount, once }}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
