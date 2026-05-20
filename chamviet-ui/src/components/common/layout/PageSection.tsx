import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import type { ElementType } from 'react';

export interface PageSectionProps extends Omit<BoxProps, 'component'> {
  /** Use the alt (container) background token instead of surface */
  isAltBackground?: boolean;
  /** Remove default vertical padding — section manages its own */
  noVerticalPad?: boolean;
  /** Semantic HTML element. Defaults to 'section'. */
  component?: ElementType;
}

export function PageSection({
  isAltBackground,
  noVerticalPad,
  component = 'section',
  sx,
  children,
  ...props
}: PageSectionProps) {
  return (
    <Box
      component={component}
      sx={{
        py: noVerticalPad ? 0 : { xs: 6, md: 10 },
        backgroundColor: isAltBackground
          ? 'var(--bg-container)'
          : 'var(--bg-surface)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

