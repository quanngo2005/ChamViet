import { Box, Stack, Typography } from '@mui/material';
import { ContentContainer } from '../../common/layout/ContentContainer';
import { PageSection } from '../../common/layout/PageSection';
import { PRODUCT_DETAIL_COPY } from '../../../data/productDetail';
import heroImage from '../../../assets/hero.png';
import heroChildAr from '../../../assets/hero-child-ar.png';
import unboxingFlatlay from '../../../assets/unboxing-flatlay.png';
import videoThumbnail from '../../../assets/video-thumbnail.png';

const stepImages = [unboxingFlatlay, heroImage, videoThumbnail, heroChildAr];

function StepCard({ label, image, index }: { label: string; image: string; index: number }) {
  return (
    <Box
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '1 / 1',
        boxShadow: '0 18px 36px rgba(78, 52, 46, 0.12)',
      }}
    >
      <Box
        component="img"
        src={image}
        alt={`Bước ${index + 1}: ${label}`}
        sx={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
          filter: 'saturate(0.9) contrast(1.05)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(35, 15, 13, 0.08), rgba(35, 15, 13, 0.64))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Typography sx={{ fontWeight: 900, color: '#fdfbf7', fontSize: 16, textAlign: 'center' }}>
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
            {hologram.steps.map((step, index) => (
              <StepCard key={step} label={step} image={stepImages[index]} index={index} />
            ))}
          </Box>
        </Stack>
      </ContentContainer>
    </PageSection>
  );
}
