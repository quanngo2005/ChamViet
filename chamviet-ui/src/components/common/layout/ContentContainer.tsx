import { Container } from '@mui/material';
import type { ContainerProps } from '@mui/material';

export function ContentContainer({ children, ...props }: ContainerProps) {
  return (
    <Container maxWidth="lg" {...props}>
      {children}
    </Container>
  );
}
