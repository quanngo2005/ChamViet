import type { Theme, Components } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import SvgIcon from '@mui/material/SvgIcon';
import { heritageColors, heritageShadows, heritageBorderRadius } from '../heritage-pulse';

// Helper to convert hex to rgba for MUI v6+ which no longer supports hex in alpha()
export function hexAlpha(hex: string, opacity: number) {
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// ----------------------------------------------------------------------

const MuiBackdrop: Components<Theme>['MuiBackdrop'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: varAlpha(theme.palette.grey['900Channel'], 0.8),
    }),
    invisible: {
      background: 'transparent',
    },
  },
};

/**
 * Heritage Pulse Button Style
 * Pill-shaped buttons with Heritage Pulse colors and no Material ripple
 */
const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
    disableRipple: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      fontFamily: theme.typography.fontFamily,
      fontWeight: 500,
      textTransform: 'none',
      borderRadius: '4px', // Match the slight radius in the image
      transition: `background-color ${theme.transitions.duration.shorter} ${theme.transitions.easing.easeInOut}, color ${theme.transitions.duration.shorter} ${theme.transitions.easing.easeInOut}, box-shadow ${theme.transitions.duration.shorter} ${theme.transitions.easing.easeInOut}, transform ${theme.transitions.duration.shorter} ${theme.transitions.easing.easeInOut}`,
    }),
    contained: () => ({
      boxShadow: 'none', // Image shows flat buttons mostly
      '&:hover': {
        boxShadow: heritageShadows.sm,
        transform: 'translateY(-1px)',
      },
    }),
    containedPrimary: () => ({
      backgroundColor: heritageColors.primary,
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: heritageColors.primaryHover,
      },
    }),
    containedSecondary: () => ({
      backgroundColor: heritageColors.bgMain,
      color: heritageColors.textMain,
      '&:hover': {
        backgroundColor: heritageColors.bgSurface,
      },
    }),
    containedInherit: ({ theme }) => ({
      color: theme.palette.common.white,
      backgroundColor: theme.palette.grey[800], // Inverted
      '&:hover': {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.grey[900],
      },
    }),
    outlined: () => ({
      borderColor: heritageColors.secondary,
      color: heritageColors.textMain,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: hexAlpha(heritageColors.secondary, 0.04),
        borderColor: heritageColors.secondaryDarker,
      },
    }),
    sizeLarge: {
      minHeight: 48,
      padding: '12px 32px',
    },
    sizeMedium: {
      padding: '8px 24px',
    },
    sizeSmall: {
      padding: '6px 16px',
    },
  },
};

/**
 * Heritage Pulse Card
 * Surface cards with Heritage background and subtle shadows
 */
const MuiCard: Components<Theme>['MuiCard'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      zIndex: 0,
      position: 'relative',
      backgroundColor: heritageColors.bgSurface,
      boxShadow: heritageShadows.md,
      borderRadius: parseInt(heritageBorderRadius.lg.replace('px', '')) + 'px',
      border: `1px solid ${hexAlpha(heritageColors.textMain, 0.08)}`,
      transition: `box-shadow ${theme.transitions.duration.shorter} ${theme.transitions.easing.easeOut}, background-color ${theme.transitions.duration.shorter} ${theme.transitions.easing.easeOut}`,
      '&:hover': {
        boxShadow: heritageShadows.lg,
      },
    }),
  },
};

const MuiCardHeader: Components<Theme>['MuiCardHeader'] = {
  defaultProps: {
    titleTypographyProps: { variant: 'h6' },
    subheaderTypographyProps: { variant: 'body2' },
  },
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3, 3, 0),
    }),
  },
};

/**
 * Heritage Pulse Input
 * Subtle borders with low-opacity outlines (15%)
 */
const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: () => ({
      backgroundColor: heritageColors.bgMain,
      color: heritageColors.textMain,
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: heritageColors.secondary,
        borderWidth: 1,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: heritageColors.secondary,
      },
    }),
    notchedOutline: ({ theme }) => ({
      borderColor: hexAlpha(heritageColors.secondary, 0.2),
      transition: `border-color ${theme.transitions.duration.shorter} ${theme.transitions.easing.easeOut}`,
    }),
  },
};

/**
 * Heritage Pulse Paper
 * Floating elements with subtle borders and controlled background
 */
const MuiPaper: Components<Theme>['MuiPaper'] = {
  defaultProps: { elevation: 0 },
  styleOverrides: {
    root: {
      backgroundImage: 'none',
      backgroundColor: heritageColors.bgSurface,
    },
    outlined: () => ({
      borderColor: hexAlpha(heritageColors.textMain, 0.12),
      border: `1px solid ${hexAlpha(heritageColors.textMain, 0.12)}`,
    }),
  },
};

const MuiTableCell: Components<Theme>['MuiTableCell'] = {
  styleOverrides: {
    head: ({ theme }) => ({
      fontSize: theme.typography.pxToRem(14),
      color: heritageColors.textSub,
      fontWeight: 600,
      backgroundColor: heritageColors.bgContainer,
      borderBottomColor: hexAlpha(heritageColors.textMain, 0.12),
    }),
    body: () => ({
      color: heritageColors.textMain,
      borderBottomColor: hexAlpha(heritageColors.textMain, 0.08),
    }),
  },
};

const MuiMenuItem: Components<Theme>['MuiMenuItem'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      ...theme.typography.body2,
      color: heritageColors.textMain,
      '&:hover': {
        backgroundColor: hexAlpha(heritageColors.primary, 0.08),
      },
      '&.Mui-selected': {
        backgroundColor: hexAlpha(heritageColors.primary, 0.12),
        '&:hover': {
          backgroundColor: hexAlpha(heritageColors.primary, 0.16),
        },
      },
    }),
  },
};

/**
 * Heritage Pulse Link
 * Links use primary red for strong visual hierarchy
 */
const MuiLink: Components<Theme>['MuiLink'] = {
  defaultProps: { underline: 'hover' },
  styleOverrides: {
    root: ({ theme }) => ({
      color: heritageColors.primary,
      cursor: 'pointer',
      transition: `color ${theme.transitions.duration.shorter} ${theme.transitions.easing.easeOut}`,
      '&:hover': {
        color: heritageColors.primaryHover,
      },
    }),
  },
};

const MuiFormControlLabel: Components<Theme>['MuiFormControlLabel'] = {
  styleOverrides: {
    label: ({ theme }) => ({
      ...theme.typography.body2,
      color: heritageColors.textMain,
    }),
  },
};

/**
 * Heritage Pulse Checkbox
 * Custom icons aligned with Heritage Pulse aesthetic
 */
const MuiCheckbox: Components<Theme>['MuiCheckbox'] = {
  defaultProps: {
    size: 'small',
    icon: (
      <SvgIcon>
        <path d="M17.9 2.318A5 5 0 0 1 22.895 7.1l.005.217v10a5 5 0 0 1-4.783 4.995l-.217.005h-10a5 5 0 0 1-4.995-4.783l-.005-.217v-10a5 5 0 0 1 4.783-4.996l.217-.004h10Zm-.5 1.5h-9a4 4 0 0 0-4 4v9a4 4 0 0 0 4 4h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4Z" />
      </SvgIcon>
    ),
    checkedIcon: (
      <SvgIcon>
        <path d="M17 2a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm-1.625 7.255-4.13 4.13-1.75-1.75a.881.881 0 0 0-1.24 0c-.34.34-.34.89 0 1.24l2.38 2.37c.17.17.39.25.61.25.23 0 .45-.08.62-.25l4.75-4.75c.34-.34.34-.89 0-1.24a.881.881 0 0 0-1.24 0Z" />
      </SvgIcon>
    ),
    indeterminateIcon: (
      <SvgIcon>
        <path d="M17,2 C19.7614,2 22,4.23858 22,7 L22,7 L22,17 C22,19.7614 19.7614,22 17,22 L17,22 L7,22 C4.23858,22 2,19.7614 2,17 L2,17 L2,7 C2,4.23858 4.23858,2 7,2 L7,2 Z M15,11 L9,11 C8.44772,11 8,11.4477 8,12 C8,12.5523 8.44772,13 9,13 L15,13 C15.5523,13 16,12.5523 16,12 C16,11.4477 15.5523,11 15,11 Z" />
      </SvgIcon>
    ),
  },
  styleOverrides: {
    root: () => ({
      color: heritageColors.textSub,
      '&.Mui-checked': {
        color: heritageColors.primary,
      },
    }),
  },
};

/**
 * Heritage Pulse Radio
 * Radio buttons with Heritage Pulse primary color
 */
const MuiRadio: Components<Theme>['MuiRadio'] = {
  defaultProps: {
    size: 'small',
    icon: (
      <SvgIcon>
        <path
          d="M12 2C13.9778 2 15.9112 2.58649 17.5557 3.6853C19.2002 4.78412 20.4819 6.3459 21.2388 8.17317C21.9957 10.0004 22.1937 12.0111 21.8079 13.9509C21.422 15.8907 20.4696 17.6725 19.0711 19.0711C17.6725 20.4696 15.8907 21.422 13.9509 21.8079C12.0111 22.1937 10.0004 21.9957 8.17317 21.2388C6.3459 20.4819 4.78412 19.2002 3.6853 17.5557C2.58649 15.9112 2 13.9778 2 12C2 6.477 6.477 2 12 2ZM12 3.5C9.74566 3.5 7.58365 4.39553 5.98959 5.98959C4.39553 7.58365 3.5 9.74566 3.5 12C3.5 14.2543 4.39553 16.4163 5.98959 18.0104C7.58365 19.6045 9.74566 20.5 12 20.5C14.2543 20.5 16.4163 19.6045 18.0104 18.0104C19.6045 16.4163 20.5 14.2543 20.5 12C20.5 9.74566 19.6045 7.58365 18.0104 5.98959C16.4163 4.39553 14.2543 3.5 12 3.5Z"
          fill="currentColor"
        />
      </SvgIcon>
    ),
    checkedIcon: (
      <SvgIcon>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 8C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17157C14.0783 8.42143 13.0609 8 12 8Z"
          fill="currentColor"
        />
      </SvgIcon>
    ),
  },
  styleOverrides: {
    root: () => ({
      color: heritageColors.textSub,
      '&.Mui-checked': {
        color: heritageColors.primary,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const components = {
  MuiCard,
  MuiLink,
  MuiPaper,
  MuiRadio,
  MuiButton,
  MuiBackdrop,
  MuiMenuItem,
  MuiCheckbox,
  MuiTableCell,
  MuiCardHeader,
  MuiOutlinedInput,
  MuiFormControlLabel,
};
