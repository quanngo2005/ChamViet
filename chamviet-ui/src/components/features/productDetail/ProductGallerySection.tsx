import { Box, Card, Stack } from '@mui/material';
import heroImage from '@assets/hero.png';

export interface ProductGallerySectionProps {
  title: string;
}

export function ProductGallerySection({ title }: ProductGallerySectionProps) {
  return (
    <Stack spacing={2}>
      {/* Main large image */}
      <Card
        sx={{
          borderRadius: '8px',
          border: '1px solid rgba(168, 50, 50, 0.05)',
          boxShadow:
            '0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={heroImage}
          alt={title}
          sx={{
            width: '100%',
            height: { xs: 340, md: 536 },
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Card>

      {/* Thumbnails row — 4 equal columns */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              borderRadius: '4px',
              border: index === 0 ? '2px solid' : '1px solid',
              borderColor:
                index === 0 ? 'primary.main' : 'rgba(168, 50, 50, 0.10)',
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              backgroundColor: 'common.white',
              cursor: 'pointer',
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt={`${title} ${index + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        ))}
      </Box>
    </Stack>
  );
}