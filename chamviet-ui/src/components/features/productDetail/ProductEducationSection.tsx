import { Box, Card, Stack, Typography } from '@mui/material';
import { ContentContainer, PageSection } from '../../common/layout';
import { PRODUCT_DETAIL_COPY } from '../../../data/productDetail';

function EducationItem({ title, description }: { title: string; description: string }) {
  return (
    <Stack direction="row" spacing={2.5} sx={{ alignItems: 'flex-start' }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          flex: '0 0 auto',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </Box>
      <Stack spacing={1}>
        <Typography sx={{ color: '#FDFBF7', fontWeight: 700, fontSize: 18 }}>{title}</Typography>
        <Typography sx={{ color: 'rgba(253, 251, 247, 0.80)', fontSize: 14, lineHeight: 1.7 }}>
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}

export function ProductEducationSection() {
  const { sustainability, education } = PRODUCT_DETAIL_COPY;

  return (
    <PageSection sx={{ py: { xs: 6, md: '80px' } }}>
      <ContentContainer>
        {/* 2-column grid, gap 48px per Figma */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: '48px' },
            alignItems: 'stretch',
          }}
        >
          {/* Left: education panel — solid red, borderRadius 24px, padding 48px */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: '24px',
              backgroundColor: 'primary.main',
              overflow: 'hidden',
              p: { xs: 4, md: '48px' },
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              justifyContent: 'center',
            }}
          >
            {/* Decorative blurred gold blob per Figma */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -64,
                right: -64,
                width: 256,
                height: 256,
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 175, 55, 0.20)',
                filter: 'blur(64px)',
                pointerEvents: 'none',
              }}
            />

            <Typography
              sx={{ color: '#fdfbf7', fontWeight: 700, fontSize: 30, position: 'relative' }}
            >
              {education.heading}
            </Typography>

            <Stack spacing={3} sx={{ position: 'relative' }}>
              {education.items.map((item) => (
                <EducationItem key={item.title} title={item.title} description={item.description} />
              ))}
            </Stack>
          </Box>

          {/* Right: sustainability specs */}
          <Stack spacing={4} sx={{ py: { md: '36px' }, justifyContent: 'center' }}>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 700, color: 'grey.900', fontSize: 30 }}>
                {sustainability.heading}
              </Typography>
              <Typography sx={{ color: '#475569', fontSize: 16, lineHeight: 2 }}>
                {sustainability.description}
              </Typography>
            </Stack>

            {/* 2×2 spec grid, gap 24px per Figma */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
              }}
            >
              {sustainability.specs.map((spec) => (
                <Card
                  key={spec.label}
                  sx={{
                    borderRadius: '12px',
                    border: '1px solid rgba(168, 50, 50, 0.08)',
                    boxShadow: '0px 2px 4px -2px rgba(0,0,0,0.10)',
                    p: 3,
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      sx={{
                        color: '#64748B',
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.2px',
                      }}
                    >
                      {spec.label}
                    </Typography>
                    <Typography sx={{ color: 'grey.900', fontSize: 18, fontWeight: 700 }}>
                      {spec.value}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </Box>
          </Stack>
        </Box>
      </ContentContainer>
    </PageSection>
  );
}