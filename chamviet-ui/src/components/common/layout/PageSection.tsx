import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

export interface PageSectionProps extends BoxProps {
  isAltBackground?: boolean;
}

export function PageSection({ isAltBackground, sx, children, ...props }: PageSectionProps) {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: isAltBackground ? 'grey.100' : 'grey.50',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
