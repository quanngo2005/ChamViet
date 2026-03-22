import { Box, Stack, Typography } from '@mui/material';
import { ContentContainer, PageSection } from '../../common/layout';
import { PRODUCT_DETAIL_COPY } from '../../../data/productDetail';

function IncludedCard({ title, description }: { title: string; description: string }) {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', height: '100%' }}>
      <Box sx={{ width: 64, height: 64, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow:
              '0px 2px 4px -2px rgba(0,0,0,0.10), 0px 4px 6px -1px rgba(0,0,0,0.10)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </Box>
      </Box>

      <Stack spacing={1}>
        <Typography sx={{ fontWeight: 700, color: 'grey.900', fontSize: 18 }}>{title}</Typography>
        <Typography sx={{ color: '#64748B', fontSize: 14, lineHeight: 1.4 }}>{description}</Typography>
      </Stack>
    </Stack>
  );
}

export function ProductIncludedSection() {
  const { included } = PRODUCT_DETAIL_COPY;

  return (
    <PageSection sx={{ py: { xs: 6, md: 8 } }}>
      <ContentContainer>
        <Box
          sx={{
            backgroundColor: 'rgba(168, 50, 50, 0.05)',
            borderRadius: { xs: '16px', md: '24px' },
            p: { xs: 4, md: '48px' },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 4, md: '48px' },
          }}
        >
          <Typography
            sx={{ fontWeight: 700, color: 'grey.900', fontSize: 30, textAlign: 'center' }}
          >
            Trong hộp có gì đây ?
          </Typography>

          {/* 3-column grid, gap 32px per Figma */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: { xs: 4, md: '32px' },
            }}
          >
            {included.map((item) => (
              <IncludedCard key={item.title} title={item.title} description={item.description} />
            ))}
          </Box>
        </Box>
      </ContentContainer>
    </PageSection>
  );
}