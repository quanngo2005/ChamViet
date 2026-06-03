import { useState } from 'react';
import { Box, ButtonBase, Card, Stack, Typography } from '@mui/material';
import heroImage from '../../../assets/hero.png';
import heroChildAr from '../../../assets/hero-child-ar.png';
import unboxingFlatlay from '../../../assets/unboxing-flatlay.png';
import videoThumbnail from '../../../assets/video-thumbnail.png';

export interface ProductGallerySectionProps {
  title: string;
}

const galleryItems = [
  { label: 'Box Chạm Việt', image: heroImage },
  { label: 'Tranh trong hộp', image: unboxingFlatlay },
  { label: 'Hiệu ứng kể chuyện', image: videoThumbnail },
  { label: 'Bé tương tác', image: heroChildAr },
];

export function ProductGallerySection({ title }: ProductGallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = galleryItems[activeIndex];

  return (
    <Stack spacing={2}>
      <Card
        sx={{
          borderRadius: '8px',
          border: '1px solid rgba(78, 52, 46, 0.10)',
          boxShadow: '0 24px 60px rgba(78, 52, 46, 0.14)',
          overflow: 'hidden',
          backgroundColor: '#23100e',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 360, md: 560 },
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={active.image}
            alt={`${title} - ${active.label}`}
            sx={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover',
              transition: 'transform 700ms ease',
              '&:hover': { transform: 'scale(1.035)' },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 18,
              right: 18,
              bottom: 18,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              color: 'white',
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {active.label}
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 800, opacity: 0.82 }}>
              {activeIndex + 1}/{galleryItems.length}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1.5,
        }}
      >
        {galleryItems.map((item, index) => (
          <ButtonBase
            key={item.label}
            onClick={() => setActiveIndex(index)}
            aria-label={`Xem ảnh ${item.label}`}
            sx={{
              borderRadius: '8px',
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              border: index === activeIndex ? '2px solid' : '1px solid',
              borderColor: index === activeIndex ? 'primary.main' : 'rgba(78, 52, 46, 0.12)',
              display: 'block',
            }}
          >
            <Box
              component="img"
              src={item.image}
              alt=""
              sx={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
                filter: index === activeIndex ? 'none' : 'saturate(0.75)',
              }}
            />
          </ButtonBase>
        ))}
      </Box>
    </Stack>
  );
}
