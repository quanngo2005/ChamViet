import { Grid } from '@mui/material';
import type { GridProps } from '@mui/material';

export function GridWrapper({ spacing = { xs: 3, md: 4 }, children, ...props }: GridProps) {
  return (
    <Grid container spacing={spacing} {...props}>
      {children}
    </Grid>
  );
}
