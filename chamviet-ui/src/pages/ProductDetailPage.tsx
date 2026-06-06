import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ContentContainer } from '../components/common/layout/ContentContainer';
import { PageSection } from '../components/common/layout/PageSection';
import { ProductEducationSection } from '../components/features/productDetail/ProductEducationSection';
import { ProductGallerySection } from '../components/features/productDetail/ProductGallerySection';
import { ProductHologramSection } from '../components/features/productDetail/ProductHologramSection';
import { ProductIncludedSection } from '../components/features/productDetail/ProductIncludedSection';
import { ProductInfoSection } from '../components/features/productDetail/ProductInfoSection';
import { ProductStorySection } from '../components/features/productDetail/ProductStorySection';
import { useProductDetailData } from '../hooks/useProductDetailData';
import { PRODUCT_DETAIL_COPY } from '../data/productDetail';
import { useParams } from 'react-router-dom';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const {
    product,
    quantity,
    setQuantity,
    includedItems,
    storySection,
    isLoading,
    errorMessage,
  } = useProductDetailData(productId);
  const [purchaseMessage, setPurchaseMessage] = useState('');

  if (isLoading) {
    return (
      <Box sx={{ backgroundColor: 'background.default', py: { xs: 6, md: 8 } }}>
        <ContentContainer>
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'grey.900' }}>
              Đang tải sản phẩm
            </Typography>
            <Typography sx={{ color: 'grey.600' }}>
              Chúng tôi đang lấy dữ liệu thật từ hệ thống sản phẩm.
            </Typography>
          </Stack>
        </ContentContainer>
      </Box>
    );
  }

  if (!product) {
    const { notFound } = PRODUCT_DETAIL_COPY;

    return (
      <Box sx={{ backgroundColor: 'background.default', py: { xs: 6, md: 8 } }}>
        <ContentContainer>
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'grey.900' }}>
              {notFound.title}
            </Typography>
            <Typography sx={{ color: 'grey.600' }}>
              {errorMessage || notFound.description}
            </Typography>
            <Box>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
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
                onClick={() => navigate('/')}
                sx={{
                  textTransform: 'none',
                  color: 'grey.600',
                  px: 0,
                  minWidth: 'auto',
                  '&:hover': { backgroundColor: 'transparent', color: 'grey.900' },
                }}
              >
                Trang chủ
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
              <ProductGallerySection title={product.title} imageUrls={product.imageUrls} />
              <ProductInfoSection
                product={product}
                quantity={quantity}
                purchaseMessage={purchaseMessage}
                onQuantityChange={setQuantity}
                onAddToCart={() => {
                  setPurchaseMessage(`Đã thêm ${quantity} box vào danh sách mua. Chúng tôi sẽ hoàn thiện thanh toán sau.`);
                }}
              />
            </Box>
          </Stack>
        </ContentContainer>
      </PageSection>

      <ProductStorySection
        heading={storySection.heading}
        paragraphs={storySection.paragraphs}
      />
      <ProductIncludedSection items={includedItems} />
      <ProductHologramSection />
      <ProductEducationSection />

    </Box>
  );
}
