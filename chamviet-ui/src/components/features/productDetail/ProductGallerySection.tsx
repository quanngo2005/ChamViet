import { useState } from 'react';
import { Box, ButtonBase, Card, IconButton, Stack, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export interface ProductGallerySectionProps {
  title: string;
  imageUrls?: string[];
}

const galleryItems = [
  { label: 'Box Chạm\u00A0Việt', image: 'https://storage.googleapis.com/chamviet-media-bucket-2026/2pwithhop.png' },
  { label: 'Sự tích Hồ Gươm', image: 'https://storage.googleapis.com/chamviet-media-bucket-2026/hoguomsingle.png' },
  { label: 'Sự tích Thánh Gióng', image: 'https://storage.googleapis.com/chamviet-media-bucket-2026/thanhgiongsingle.png' },
  { label: 'Hộp phản chiếu', image: 'https://storage.googleapis.com/chamviet-media-bucket-2026/peperghost.png' },
];

export function ProductGallerySection({ title, imageUrls }: ProductGallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const resolvedGalleryItems = imageUrls && imageUrls.length > 0
    ? imageUrls.map((image, index) => ({
      label: index === 0 ? title : `Hình ảnh ${index + 1}`,
      image,
    }))
    : galleryItems;
  const safeActiveIndex = Math.min(activeIndex, Math.max(resolvedGalleryItems.length - 1, 0));
  const active = resolvedGalleryItems[safeActiveIndex];
  const hasMultipleImages = resolvedGalleryItems.length > 1;

  const showPreviousImage = () => {
    setActiveIndex((current) => (
      current === 0 ? resolvedGalleryItems.length - 1 : current - 1
    ));
  };

  const showNextImage = () => {
    setActiveIndex((current) => (
      current + 1 >= resolvedGalleryItems.length ? 0 : current + 1
    ));
  };

  return (
    <Stack spacing={2.25}>
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
              {safeActiveIndex + 1}/{resolvedGalleryItems.length}
            </Typography>
          </Box>
          {hasMultipleImages && (
            <>
              <IconButton
                onClick={showPreviousImage}
                aria-label="Xem ảnh trước"
                sx={{
                  position: 'absolute',
                  left: { xs: 14, md: 18 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: { xs: 42, md: 48 },
                  height: { xs: 42, md: 48 },
                  color: '#ffffff',
                  backgroundColor: 'rgba(35, 16, 14, 0.62)',
                  border: '1px solid rgba(255,255,255,0.24)',
                  backdropFilter: 'blur(10px)',
                  transition: 'background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
                  '&:hover': {
                    backgroundColor: 'rgba(35, 16, 14, 0.82)',
                    transform: 'translateY(-50%) translateX(-2px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.22)',
                  },
                  '&:focus-visible': {
                    outline: '3px solid rgba(255,255,255,0.66)',
                    outlineOffset: 2,
                  },
                }}
              >
                <ChevronLeft size={22} />
              </IconButton>
              <IconButton
                onClick={showNextImage}
                aria-label="Xem ảnh tiếp theo"
                sx={{
                  position: 'absolute',
                  right: { xs: 14, md: 18 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: { xs: 42, md: 48 },
                  height: { xs: 42, md: 48 },
                  color: '#ffffff',
                  backgroundColor: 'rgba(35, 16, 14, 0.62)',
                  border: '1px solid rgba(255,255,255,0.24)',
                  backdropFilter: 'blur(10px)',
                  transition: 'background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
                  '&:hover': {
                    backgroundColor: 'rgba(35, 16, 14, 0.82)',
                    transform: 'translateY(-50%) translateX(2px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.22)',
                  },
                  '&:focus-visible': {
                    outline: '3px solid rgba(255,255,255,0.66)',
                    outlineOffset: 2,
                  },
                }}
              >
                <ChevronRight size={22} />
              </IconButton>
            </>
          )}
        </Box>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: { xs: 1.25, md: 1.75 },
        }}
      >
        {resolvedGalleryItems.map((item, index) => (
          <ButtonBase
            key={item.label}
            onClick={() => setActiveIndex(index)}
            aria-label={`Xem ảnh ${item.label}`}
            sx={{
              borderRadius: '8px',
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              border: index === safeActiveIndex ? '2px solid' : '1px solid',
              borderColor: index === safeActiveIndex ? 'primary.main' : 'rgba(78, 52, 46, 0.12)',
              display: 'block',
              transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 22px rgba(78, 52, 46, 0.14)',
                borderColor: index === safeActiveIndex ? 'primary.main' : 'rgba(168, 50, 50, 0.32)',
              },
              '&:focus-visible': {
                outline: '3px solid rgba(168, 50, 50, 0.30)',
                outlineOffset: 2,
              },
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
                filter: index === safeActiveIndex ? 'none' : 'saturate(0.75)',
              }}
            />
          </ButtonBase>
        ))}
      </Box>
    </Stack>
  );
}
