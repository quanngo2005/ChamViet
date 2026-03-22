import { Stack } from '@mui/material';
import type { StackProps } from '@mui/material';

export function StackWrapper({ spacing = { xs: 4, md: 8 }, children, ...props }: StackProps) {
  return (
    <Stack spacing={spacing} {...props}>
      {children}
    </Stack>
  );
}
