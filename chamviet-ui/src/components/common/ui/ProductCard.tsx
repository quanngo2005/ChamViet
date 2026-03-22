import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import type { Product } from '../../../types/product';

export interface ProductCardProps {
  product: Product;
  onOpen: (id: string) => void;
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  return (
    <Card
      onClick={() => onOpen(product.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen(product.id);
      }}
      tabIndex={0}
      role="button"
      sx={{
        height: '100%',
        borderRadius: '8px',
        border: '1px solid rgba(168, 50, 50, 0.05)',
        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        outline: 'none',
        '&:focus-visible': { boxShadow: '0 0 0 4px rgba(168, 50, 50, 0.18)' },
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={product.image || 'https://www.figma.com/api/mcp/asset/5220edd4-2957-4ae3-81d3-e4e40de08253'}
          alt={product.title}
          sx={{ width: '100%', height: 278, objectFit: 'cover', display: 'block' }}
        />

        {product.badgeLabel && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              px: 1,
              py: 0.5,
              borderRadius: '2px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                lineHeight: '15px',
              }}
            >
              {product.badgeLabel}
            </Typography>
          </Box>
        )}

        <IconButton
          aria-label="Yêu thích"
          onClick={(event) => {
            event.stopPropagation();
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#94a3b8',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
          }}
        >
          ♡
        </IconButton>
      </Box>

      <Stack spacing={1} sx={{ p: 2, flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          {product.ageLabel && (
            <Box
              sx={{
                px: 1,
                py: '2px',
                borderRadius: '12px',
                backgroundColor: 'rgba(168, 50, 50, 0.10)',
              }}
            >
              <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: 10 }}>
                {product.ageLabel}
              </Typography>
            </Box>
          )}
          {product.topicLabel && (
            <Box
              sx={{
                px: 1,
                py: '2px',
                borderRadius: '12px',
                backgroundColor: 'grey.100',
              }}
            >
              <Typography sx={{ color: 'grey.600', fontWeight: 700, fontSize: 10 }}>
                {product.topicLabel}
              </Typography>
            </Box>
          )}
        </Stack>

        <Typography sx={{ color: 'grey.900', fontWeight: 700, fontSize: 18, lineHeight: '28px' }}>
          {product.title}
        </Typography>

        <Typography
          sx={{
            color: 'grey.600',
            fontSize: 12,
            lineHeight: '16px',
            whiteSpace: 'pre-line',
          }}
        >
          {product.shortDescription}
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: 18, lineHeight: '28px' }}>
            {product.priceLabel}
          </Typography>

          <IconButton
            aria-label="Thêm vào giỏ"
            onClick={(event) => {
              event.stopPropagation();
            }}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              backgroundColor: 'primary.main',
              color: 'common.white',
              boxShadow:
                '0px 4px 6px -4px rgba(168, 50, 50, 0.20), 0px 10px 15px -3px rgba(168, 50, 50, 0.20)',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            🛒
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  );
}
