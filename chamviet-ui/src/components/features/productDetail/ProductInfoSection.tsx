import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { QuantitySelector } from './QuantitySelector';
import type { Product } from '../../../pages/products/catalog';

export interface ProductInfoSectionProps {
  product: Product;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void;
}

export function ProductInfoSection({ product, quantity, onQuantityChange, onAddToCart }: ProductInfoSectionProps) {
  return (
    <Stack spacing={3} sx={{ height: '100%', pt: { xs: 0, md: 2 } }}>
      <Stack spacing={1}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'primary.main',
            letterSpacing: '1.2px',
          }}
        >
          {product.collectionLabel}
        </Typography>

        <Typography
          sx={{
            color: 'grey.900',
            fontWeight: 900,
            fontSize: { xs: 36, md: 48 },
            lineHeight: 1.1,
          }}
        >
          {product.title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
          <Stack direction="row" spacing={0.5}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} sx={{ color: '#D4AF37', fontSize: 14 }}>★</Box>
            ))}
          </Stack>
          <Typography sx={{ color: '#64748B', fontWeight: 500, fontSize: 14 }}>
            {product.reviewsLabel}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: 30 }}>
          {product.priceLabel}
        </Typography>
        {product.compareAtPriceLabel && (
          <Typography sx={{ color: '#94A3B8', textDecoration: 'line-through', fontWeight: 500, fontSize: 18 }}>
            {product.compareAtPriceLabel}
          </Typography>
        )}
        {product.discountLabel && (
          <Box sx={{ px: 1.5, py: 0.5, borderRadius: '12px', backgroundColor: 'rgba(168, 50, 50, 0.10)' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: 12 }}>
              {product.discountLabel}
            </Typography>
          </Box>
        )}
      </Stack>

      <Typography sx={{ color: '#475569', fontSize: 18, lineHeight: 1.6, fontWeight: 400 }}>
        {product.shortDescription || 'Trải nghiệm huyền thoại về Hoàng tử Lang Liêu qua bộ xếp hình bằng gỗ thủ công này. Một hành trình xúc giác kết hợp thần thoại Việt Nam cổ xưa với cách kể chuyện tương tác hiện đại.'}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <QuantitySelector value={quantity} onChange={onQuantityChange} />
        <Button
          variant="contained"
          fullWidth
          onClick={onAddToCart}
          startIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          }
          sx={{
            height: 56,
            borderRadius: '8px',
            textTransform: 'none',
            backgroundColor: 'primary.main',
            fontSize: 16,
            fontWeight: 700,
            boxShadow: '0px 4px 6px -4px rgba(168, 50, 50, 0.20), 0px 10px 15px -3px rgba(168, 50, 50, 0.20)',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Thêm giỏ hàng
        </Button>
      </Stack>

      <Divider sx={{ borderColor: 'rgba(168, 50, 50, 0.10)', my: 1 }} />

      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8l5 0M16 11l5 0M1 16l5 5 4-4" />
            </svg>
          </Box>
          <Typography sx={{ color: '#334155', fontWeight: 500, fontSize: 14 }}>
            Miễn phí giao hàng 2 bộ
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </Box>
          <Typography sx={{ color: '#334155', fontWeight: 500, fontSize: 14 }}>
            Đi kèm hướng dẫn sử dụng
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}