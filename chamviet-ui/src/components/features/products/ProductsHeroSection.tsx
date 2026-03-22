import { Box, Typography } from '@mui/material';
import { ContentContainer, StackWrapper } from '../../common/layout';

export interface ProductsHeroSectionProps {
  title: string;
  description: string;
}

export function ProductsHeroSection({ title, description }: ProductsHeroSectionProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'background.default',
        py: { xs: 6, md: 8 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          background:
            'radial-gradient(circle at top left, rgba(168, 50, 50, 1) 0%, rgba(168, 50, 50, 0) 60%)',
          pointerEvents: 'none',
        }}
      />
      <ContentContainer sx={{ position: 'relative' }}>
        <StackWrapper spacing={2}>
          <Typography
            variant="h4"
            sx={{
              color: 'grey.900',
              fontWeight: 900,
              fontSize: { xs: 30, md: 36 },
              lineHeight: { xs: '36px', md: '40px' },
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ color: 'grey.600', fontSize: 18, maxWidth: 760, lineHeight: 1.6 }}>
            {description}
          </Typography>
        </StackWrapper>
      </ContentContainer>
    </Box>
  );
}
