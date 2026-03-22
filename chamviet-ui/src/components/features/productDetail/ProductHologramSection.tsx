import { Box, Stack, Typography } from '@mui/material';
import { ContentContainer, PageSection } from '../../common/layout';
import heroImage from '@assets/hero.png';
import { PRODUCT_DETAIL_COPY } from '../../../data/productDetail';

function StepCard({ label }: { label: string }) {
  return (
    <Box
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '1 / 1',
      }}
    >
      <Box
        component="img"
        src={heroImage}
        alt={label}
        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(168, 50, 50, 0.20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700, color: '#fdfbf7', fontSize: 16, textAlign: 'center' }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

export function ProductHologramSection() {
  const { hologram } = PRODUCT_DETAIL_COPY;

  return (
    <PageSection sx={{ pb: { xs: 6, md: 10 } }}>
      <ContentContainer>
        <Stack spacing={{ xs: 4, md: '48px' }}>
          <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, color: 'grey.900', fontSize: 30 }}>
              {hologram.heading}
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: 16, maxWidth: 720 }}>
              {hologram.description}
            </Typography>
          </Stack>

          {/* 4-column grid, gap 16px per Figma */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: '16px',
            }}
          >
            {hologram.steps.map((step) => (
              <StepCard key={step} label={step} />
            ))}
          </Box>
        </Stack>
      </ContentContainer>
    </PageSection>
  );
}