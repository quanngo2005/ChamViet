import { Box, Typography, Stack, Button, Card } from '@mui/material';
import { PageSection, ContentContainer } from '../../common/layout';

export interface HomeHeroSectionProps {
  copy: any;
  images: any;
}

export function HomeHeroSection({ copy, images }: HomeHeroSectionProps) {
  return (
    <PageSection
      sx={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: { xs: 8, md: 12 },
        paddingBottom: { xs: 8, md: 12 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          right: 40,
          width: 128,
          height: 128,
          backgroundColor: 'rgba(217, 164, 65, 0.2)',
          borderRadius: '12px',
          filter: 'blur(32px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          width: 192,
          height: 192,
          backgroundColor: 'secondary.light',
          borderRadius: '12px',
          filter: 'blur(32px)',
          pointerEvents: 'none',
          opacity: 0.3
        }}
      />

      <ContentContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 6,
            alignItems: 'center',
          }}
        >
          <Box>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: 'inline-flex',
                  backgroundColor: 'rgba(217, 164, 65, 0.2)',
                  border: '1px solid rgba(217, 164, 65, 0.3)',
                  borderRadius: '12px',
                  padding: '7px 17px',
                  alignItems: 'center',
                  gap: 1,
                  width: 'fit-content',
                }}
              >
                <Box component="span" sx={{ fontSize: '16px' }}>🎁</Box>
                <Typography sx={{ color: 'secondary.dark', fontWeight: 500, fontSize: '14px' }}>
                  {copy.badge}
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  color: 'secondary.dark',
                  fontWeight: 'bold',
                  fontSize: { xs: '42px', md: '60px' },
                  lineHeight: 1.2,
                }}
              >
                {copy.titleStart}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  {copy.titleHighlight}
                </Box>
              </Typography>

              <Typography sx={{ color: 'secondary.main', fontSize: '20px', lineHeight: 1.4, maxWidth: '512px' }}>
                {copy.description}
              </Typography>

              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'common.white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  }}
                >
                  {copy.primaryCta}
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(168, 50, 50, 0.2)',
                    color: 'secondary.dark',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    textTransform: 'none',
                  }}
                >
                  {copy.secondaryCta}
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Box>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
                height: { xs: 350, md: 500 },
                border: '4px solid',
                borderColor: 'background.default',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={images.heroImage}
                alt="Hero"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
                }}
              />
              <Stack spacing={1} sx={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
                <Stack direction="row" spacing={1}>
                  <Box
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'common.white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {copy.productBadge1}
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'secondary.main',
                      color: 'secondary.darker',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {copy.productBadge2}
                  </Box>
                </Stack>
                <Typography sx={{ color: 'common.white', fontWeight: 'bold', fontSize: '24px' }}>
                  {copy.productTitle}
                </Typography>
              </Stack>
            </Card>
          </Box>
        </Box>
      </ContentContainer>
    </PageSection>
  );
}
