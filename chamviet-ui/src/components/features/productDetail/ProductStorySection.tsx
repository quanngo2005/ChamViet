import { Box, Stack, Typography } from '@mui/material';
import { ContentContainer } from '../../common/layout/ContentContainer';
import { PageSection } from '../../common/layout/PageSection';
import { PRODUCT_DETAIL_COPY } from '../../../data/productDetail';
import { BookOpen } from 'lucide-react';

export interface ProductStorySectionProps {
  heading?: string;
  paragraphs?: string[];
}

export function ProductStorySection({ heading, paragraphs }: ProductStorySectionProps) {
  const { story } = PRODUCT_DETAIL_COPY;
  const storyHeading = heading?.trim() || story.heading;
  const storyParagraphs = paragraphs && paragraphs.length > 0 ? paragraphs : story.paragraphs;

  return (
    <PageSection sx={{ py: { xs: 18, md: 10 } }}>
      <ContentContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: { xs: 4, md: 5 },
            alignItems: 'center',
            maxWidth: 860,
            mx: 'auto',
          }}
        >
          {/* Left: text */}
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 55,
                  height: 55,
                  borderRadius: '4px',
                  backgroundColor: 'rgba(168, 50, 50, 0.10)',
                  display: 'flex',
                  padding: '5',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                <BookOpen size={32} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: 'grey.900', fontSize: 30 }}>
                {storyHeading}
              </Typography>
            </Stack>

            <Stack spacing={4}>
              {storyParagraphs.map((p) => (
                <Typography
                  key={p}
                  sx={{ color: '#475569', fontSize: 16, lineHeight: 2, textAlign: 'justify', whiteSpace: 'pre-line' }}
                >
                  {p}
                </Typography>
              ))}
            </Stack>
          </Stack>

        </Box>
      </ContentContainer>
    </PageSection>
  );
}
