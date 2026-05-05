/**
 * Heritage Pulse Design System Tokens
 * 
 * A comprehensive design system inspired by "Organic Brutalism" and Vietnamese heritage.
 * Crimson & Clay color palette with earthy tones and meaningful typography.
 * 
 * @see Design System Specification: design.md
 */

/**
 * Primary Colors - Crimson & Clay Palette
 * The heartbeat of the design system
 */
export const heritageColors = {
  // Brand Primary: Deep Crimson
  primary: '#C62828',
  primaryHover: '#E53935',
  primaryLight: '#EF5350',
  primaryDarker: '#8B1A1A',

  // Secondary: Clay/Terracotta
  secondary: '#8B5E3C',
  secondaryLight: '#A0704D',
  secondaryDarker: '#6B4423',

  // Accent: Gold
  accent: '#D4AF37',
  accentLight: '#E6C76B',
  accentDarker: '#A68A2F',

  // Neutrals: Cream & Off-white
  bgMain: '#F5EFE6',      // Main page background
  bgSurface: '#FDFBF7',   // Cards, floating UI
  bgContainer: '#F8F6F6', // Sections
  textMain: '#4E342E',    // Primary text
  textSub: '#6D4C41',     // Secondary text

  // Semantic Colors
  success: '#2E7D32',
  error: '#B71C1C',
  warning: '#ED6C02',
  info: '#0288D1',
};

/**
 * Shadow Tokens
 * Subtle elevation hierarchy following "No-Line" rule
 */
export const heritageShadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.08)',
  md: '0 2px 6px rgba(0, 0, 0, 0.12)',
  lg: '0 6px 16px rgba(0, 0, 0, 0.16)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.2)',
};

/**
 * Typography Tokens
 * Be Vietnam Pro for Vietnamese heritage celebration
 */
export const heritageTypography = {
  fontFamily: '"Be Vietnam Pro", sans-serif',
  fontFamilyFallback: '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  // Sizes (with clamping for responsiveness)
  sizes: {
    display: 'clamp(32px, 3.5vw, 60px)',  // 3.75rem
    headline1: 'clamp(28px, 2.8vw, 36px)', // 2.25rem
    headline2: 'clamp(24px, 2.4vw, 30px)', // 1.875rem
    title1: 'clamp(20px, 2vw, 24px)',     // 1.5rem
    title2: 'clamp(16px, 1.6vw, 20px)',   // 1.25rem
    body: 'clamp(16px, 1.1vw, 18px)',     // 1.125rem (default reading size)
    label: 'clamp(13px, 0.9vw, 14px)',    // 0.875rem
    small: 'clamp(12px, 0.85vw, 12px)',   // 0.75rem
  },

  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

/**
 * Spacing Scale
 * Follows Material Design spacing (8px base unit)
 */
export const heritageSpacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};

/**
 * Border Radius
 * "Organic Brutalism" with subtle rounded corners
 */
export const heritageBorderRadius = {
  xs: '2px',
  sm: '4px',
  md: '8px',      // Default
  lg: '12px',     // Cards, sections
  xl: '16px',     // Modals, hero sections
  full: '9999px', // Pills
};

/**
 * Transitions & Animations
 * Subtle, purpose-driven movements (200ms standard)
 */
export const heritageTransitions = {
  duration: {
    shortest: '150ms',
    shorter: '200ms',
    standard: '300ms',
    longer: '500ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

/**
 * Breakpoints
 * Mobile-first responsive design
 */
export const heritageBreakpoints = {
  xs: '0px',     // Mobile
  sm: '640px',   // Tablet
  md: '1024px',  // Desktop
  lg: '1280px',  // Wide desktop
  xl: '1536px',  // Extra wide
};

/**
 * Z-index Scale
 * Structured depth for stacking contexts
 */
export const heritageZIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};

/**
 * Texture Patterns
 * Limited to hero sections (24px radial dot grid at 10% opacity)
 */
export const heritagePatterns = {
  dotGrid: `
    radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)
  `,
  dotGridSize: '24px',
};

/**
 * CSS Custom Property Definitions
 * For runtime theme switching and component access
 */
export const heritageCSSVariables = {
  // Colors
  '--color-primary': heritageColors.primary,
  '--color-primary-hover': heritageColors.primaryHover,
  '--color-primary-light': heritageColors.primaryLight,
  '--color-primary-darker': heritageColors.primaryDarker,

  '--color-secondary': heritageColors.secondary,
  '--color-secondary-light': heritageColors.secondaryLight,
  '--color-secondary-darker': heritageColors.secondaryDarker,

  '--color-accent': heritageColors.accent,
  '--color-accent-light': heritageColors.accentLight,
  '--color-accent-darker': heritageColors.accentDarker,

  '--color-bg-main': heritageColors.bgMain,
  '--color-bg-surface': heritageColors.bgSurface,
  '--color-bg-container': heritageColors.bgContainer,
  '--color-text-main': heritageColors.textMain,
  '--color-text-sub': heritageColors.textSub,

  '--color-success': heritageColors.success,
  '--color-error': heritageColors.error,
  '--color-warning': heritageColors.warning,
  '--color-info': heritageColors.info,

  // Shadows
  '--shadow-sm': heritageShadows.sm,
  '--shadow-md': heritageShadows.md,
  '--shadow-lg': heritageShadows.lg,
  '--shadow-xl': heritageShadows.xl,

  // Spacing
  '--spacing-xs': heritageSpacing.xs,
  '--spacing-sm': heritageSpacing.sm,
  '--spacing-md': heritageSpacing.md,
  '--spacing-lg': heritageSpacing.lg,
  '--spacing-xl': heritageSpacing.xl,
  '--spacing-2xl': heritageSpacing['2xl'],
  '--spacing-3xl': heritageSpacing['3xl'],

  // Typography
  '--font-family': heritageTypography.fontFamily,

  // Border Radius
  '--radius-xs': heritageBorderRadius.xs,
  '--radius-sm': heritageBorderRadius.sm,
  '--radius-md': heritageBorderRadius.md,
  '--radius-lg': heritageBorderRadius.lg,
  '--radius-xl': heritageBorderRadius.xl,
  '--radius-full': heritageBorderRadius.full,
} as const;

export type HeritageCSSVariable = keyof typeof heritageCSSVariables;
