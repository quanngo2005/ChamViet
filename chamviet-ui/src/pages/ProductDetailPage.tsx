import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ContentContainer, PageSection } from '../components/common/layout';
import {
  ProductGallerySection,
  ProductInfoSection,
  ProductStorySection,
  ProductIncludedSection,
  ProductHologramSection,
  ProductEducationSection,
  ProductRelatedSection,
} from '../components/features/productDetail';
import { useProductDetailData } from '../hooks/useProductDetailData';
import { PRODUCT_DETAIL_COPY } from '../data/productDetail';
import { useParams } from 'react-router-dom';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { product, quantity, setQuantity, relatedProducts } = useProductDetailData(productId);

  if (!product) {
    const { notFound } = PRODUCT_DETAIL_COPY;

    return (
      <Box sx={{ backgroundColor: 'background.default', py: { xs: 6, md: 8 } }}>
        <ContentContainer>
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'grey.900' }}>
              {notFound.title}
            </Typography>
            <Typography sx={{ color: 'grey.600' }}>{notFound.description}</Typography>
            <Box>
              <Button
                variant="contained"
                onClick={() => navigate('/products')}
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  textTransform: 'none',
                  borderRadius: '12px',
                }}
              >
                {notFound.backButton}
              </Button>
            </Box>
          </Stack>
        </ContentContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <PageSection sx={{ py: { xs: 4, md: 6 } }}>
        <ContentContainer>
          <Stack spacing={2.5}>
            {/* Breadcrumb */}
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                onClick={() => navigate('/products')}
                sx={{
                  textTransform: 'none',
                  color: 'grey.600',
                  px: 0,
                  minWidth: 'auto',
                  '&:hover': { backgroundColor: 'transparent', color: 'grey.900' },
                }}
              >
                Sản phẩm
              </Button>
              <Typography sx={{ color: 'grey.600' }}>/</Typography>
              <Typography sx={{ color: 'grey.900', fontWeight: 700 }}>{product.title}</Typography>
            </Stack>

            {/* Two-column: Gallery (left) | Info (right) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 3, md: 6 },
                alignItems: 'start',
              }}
            >
              <ProductGallerySection title={product.title} />
              <ProductInfoSection
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={() => {
                  // Placeholder for Add to Cart
                }}
              />
            </Box>
          </Stack>
        </ContentContainer>
      </PageSection>

      <ProductStorySection />
      <ProductIncludedSection />
      <ProductHologramSection />
      <ProductEducationSection />
      
    </Box>
  );
}