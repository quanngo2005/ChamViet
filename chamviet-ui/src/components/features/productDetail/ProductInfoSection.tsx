import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { CheckCircle2, FileText, ShoppingBag, Star, Truck } from 'lucide-react';
import { QuantitySelector } from './QuantitySelector';
import type { Product } from '../../../types/product';

export interface ProductInfoSectionProps {
  product: Product;
  quantity: number;
  purchaseMessage?: string;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void;
}

export function ProductInfoSection({
  product,
  quantity,
  purchaseMessage,
  onQuantityChange,
  onAddToCart,
}: ProductInfoSectionProps) {
  return (
    <Stack spacing={3} sx={{ height: '100%', pt: { xs: 0, md: 2 } }}>
      <Stack spacing={1.25}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'primary.main',
            letterSpacing: '0.08em',
          }}
        >
          {product.collectionLabel}
        </Typography>

        <Typography
          component="h1"
          sx={{
            color: 'grey.900',
            fontWeight: 900,
            fontSize: { xs: 38, md: 56 },
            lineHeight: 0.98,
            letterSpacing: 0,
          }}
        >
          {product.title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
          <Stack direction="row" spacing={0.35} aria-label="Đánh giá 5 sao">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />
            ))}
          </Stack>
          <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: 14 }}>
            {product.reviewsLabel}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: 34 }}>
          {product.priceLabel}
        </Typography>
        {product.compareAtPriceLabel && (
          <Typography sx={{ color: '#94A3B8', textDecoration: 'line-through', fontWeight: 500, fontSize: 18 }}>
            {product.compareAtPriceLabel}
          </Typography>
        )}
        {product.discountLabel && (
          <Box sx={{ px: 1.5, py: 0.5, borderRadius: '8px', backgroundColor: 'rgba(168, 50, 50, 0.10)' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 800, fontSize: 12 }}>
              {product.discountLabel}
            </Typography>
          </Box>
        )}
      </Stack>

      <Typography sx={{ color: '#475569', fontSize: 18, lineHeight: 1.7, fontWeight: 400 }}>
        {product.shortDescription}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}>
        <QuantitySelector value={quantity} onChange={onQuantityChange} />
        <Button
          variant="contained"
          fullWidth
          onClick={onAddToCart}
          startIcon={<ShoppingBag size={19} />}
          sx={{
            height: 56,
            borderRadius: '8px',
            textTransform: 'none',
            backgroundColor: 'primary.main',
            fontSize: 16,
            fontWeight: 800,
            boxShadow: '0 18px 32px rgba(168, 50, 50, 0.24)',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Thêm vào danh sách mua
        </Button>
      </Stack>

      {purchaseMessage && (
        <Box
          role="status"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: '8px',
            px: 2,
            py: 1.5,
            color: 'success.dark',
            backgroundColor: 'rgba(46, 125, 50, 0.08)',
            border: '1px solid rgba(46, 125, 50, 0.14)',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={18} />
          {purchaseMessage}
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(168, 50, 50, 0.10)', my: 1 }} />

      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            <Truck size={20} />
          </Box>
          <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: 14 }}>
            Một box gồm 2 tranh văn hóa Việt
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            <FileText size={20} />
          </Box>
          <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: 14 }}>
            Đi kèm hướng dẫn sử dụng và mã mở truyện
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
