import { Box, Stack, Typography } from '@mui/material';
import { ContentContainer } from '../../common/layout/ContentContainer';
import { PageSection } from '../../common/layout/PageSection';
import { PRODUCT_DETAIL_COPY } from '../../../data/productDetail';
import { BookOpen } from 'lucide-react';
import heroChildAr from '../../../assets/hero-child-ar.png';

export function ProductStorySection() {
  const { story } = PRODUCT_DETAIL_COPY;

  return (
    <PageSection sx={{ py: { xs: 8, md: 10 } }}>
      <ContentContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: '48px' },
            alignItems: 'center',
          }}
        >
          {/* Left: text */}
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 38,
                  height: 35.5,
                  borderRadius: '4px',
                  backgroundColor: 'rgba(168, 50, 50, 0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                <BookOpen size={22} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: 'grey.900', fontSize: 30 }}>
                {story.heading}
              </Typography>
            </Stack>

            <Stack spacing={4}>
              {story.paragraphs.map((p) => (
                <Typography
                  key={p}
                  sx={{ color: '#475569', fontSize: 16, lineHeight: 2, whiteSpace: 'pre-line' }}
                >
                  {p}
                </Typography>
              ))}
            </Stack>
          </Stack>

          {/* Right: rotated image card — gold border per Figma */}
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: { xs: 4, md: 0 } }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 550,
                transform: 'rotate(3deg)',
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.20)',
                borderRadius: '8px',
                p: 2,
                boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
              }}
            >
              <Box
                component="img"
                src={heroChildAr}
                alt="Bé trải nghiệm câu chuyện văn hóa qua Chạm Việt"
                sx={{
                  width: '100%',
                  aspectRatio: '16/9',
                  display: 'block',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
            </Box>
          </Box>
        </Box>
      </ContentContainer>
    </PageSection>
  );
}
