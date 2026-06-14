import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowRight, MessageCircle, PackageCheck, Sparkles } from 'lucide-react';

import {
  ProductEducationSection,
  ProductGallerySection,
  ProductIncludedSection,
  ProductStorySection,
} from '../components/features/productDetail';
import ContactRequestForm from '../components/common/ContactRequestForm';
import { ContentContainer, PageSection } from '../components/common/layout';
import { HOME_IMAGES, HOME_PRODUCT } from '../data/home';
import type { Product } from '../types/product';

const PREORDER_PRODUCT: Product = {
  id: HOME_PRODUCT.id,
  title: HOME_PRODUCT.boxLabel,
  collectionLabel: 'Bộ sư tập: Hào Khí Việt Nam',
  priceLabel: HOME_PRODUCT.price,
  reviewsLabel: 'Dành cho gia đình yêu văn hóa Việt',
  shortDescription:
    "Trang này trả lời những câu hỏi cụ thể trước khi mua: trong hộp có gì, bé hợp với bộ nào, và gia đình sẽ dùng bộ này ra sao ở nhà.",
  badgeLabel: 'Đặt trước',
  image: HOME_IMAGES.unboxingFlatlayWebp,
};

function scrollToPreorderForm() {
  const target = document.getElementById('preorder-form');
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ProductHero() {
  return (
    <PageSection
      sx={{
        py: { xs: 6, md: 10 },
        background:
          'radial-gradient(circle at 12% 18%, rgba(198, 40, 40, 0.10), transparent 28%), linear-gradient(180deg, #fdfbf7 0%, #f5efe6 100%)',
      }}
    >
      <ContentContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.05fr) minmax(360px, 0.95fr)' },
            gap: { xs: 4, md: 7 },
            alignItems: 'center',
          }}
        >
          <ProductGallerySection title={PREORDER_PRODUCT.title} />

          <Stack spacing={3.25}>
            <Stack spacing={1.35}>
              <Typography
                sx={{
                  width: 'fit-content',
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 999,
                  color: 'primary.main',
                  backgroundColor: 'rgba(168, 50, 50, 0.08)',
                  border: '1px solid rgba(168, 50, 50, 0.14)',
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {PREORDER_PRODUCT.collectionLabel}
              </Typography>

              <Typography
                component="h1"
                sx={{
                  color: 'var(--text-h)',
                  fontSize: { xs: 38, sm: 48, md: 64 },
                  fontWeight: 950,
                  lineHeight: 1,
                  letterSpacing: 0,
                }}
              >
                {PREORDER_PRODUCT.title}
              </Typography>

              <Typography sx={{ color: 'var(--text-sub)', fontSize: { xs: 16, md: 18 }, lineHeight: 1.78 }}>
                {PREORDER_PRODUCT.shortDescription}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography sx={{ color: 'primary.main', fontSize: { xs: 34, md: 40 }, fontWeight: 950 }}>
                {PREORDER_PRODUCT.priceLabel}
              </Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.65,
                  borderRadius: '8px',
                  color: 'var(--secondary)',
                  backgroundColor: 'rgba(139, 94, 60, 0.10)',
                  fontSize: 13,
                  fontWeight: 850,
                }}
              >
                {PREORDER_PRODUCT.badgeLabel}
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
              <Button
                onClick={scrollToPreorderForm}
                variant="contained"
                disableElevation
                endIcon={<ArrowRight size={18} />}
                sx={{
                  minHeight: 56,
                  borderRadius: '8px',
                  px: 3,
                  textTransform: 'none',
                  backgroundColor: 'primary.main',
                  fontSize: 16,
                  fontWeight: 900,
                  boxShadow: '0 18px 32px rgba(168, 50, 50, 0.22)',
                  WebkitTapHighlightColor: 'transparent',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                Đi tới form đặt trước
              </Button>

              <Button
                component={RouterLink}
                to="/how-to-play"
                variant="outlined"
                sx={{
                  minHeight: 56,
                  borderRadius: '8px',
                  px: 3,
                  color: 'primary.main',
                  borderColor: 'rgba(168, 50, 50, 0.24)',
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 850,
                  WebkitTapHighlightColor: 'transparent',
                  '&:hover': {
                    borderColor: 'rgba(168, 50, 50, 0.42)',
                    backgroundColor: 'rgba(168, 50, 50, 0.05)',
                  },
                }}
              >
                Xem cách chơi
              </Button>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.25,
              }}
            >
              {[
                { icon: PackageCheck, label: '2 tranh ghép gỗ trong bộ' },
                { icon: Sparkles, label: "Hộp phản chiếu 3D đi kèm" },
              ].map(({ icon: Icon, label }) => (
                <Box
                  key={label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    minHeight: 54,
                    px: 1.5,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.68)',
                    border: '1px solid rgba(78, 52, 46, 0.10)',
                    color: 'var(--text-h)',
                    fontWeight: 750,
                  }}
                >
                  <Box sx={{ color: 'primary.main', display: 'flex' }}>
                    <Icon size={20} />
                  </Box>
                  {label}
                </Box>
              ))}
            </Box>
          </Stack>
        </Box>
      </ContentContainer>
    </PageSection>
  );
}

function PreorderInfoSection() {
  return (
    <PageSection id="preorder-form" sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fffaf0', scrollMarginTop: '96px' }}>
      <ContentContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.88fr 1.12fr' },
            gap: { xs: 3, md: 5 },
            alignItems: 'start',
            p: { xs: 3, md: 4 },
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(78, 52, 46, 0.10)',
            boxShadow: '0 18px 40px rgba(78, 52, 46, 0.08)',
          }}
        >
          <Stack spacing={1}>
            <Typography sx={{ color: 'primary.main', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Thông tin đặt trước
            </Typography>
            <Typography sx={{ color: 'var(--text-h)', fontSize: { xs: 26, md: 34 }, fontWeight: 950, lineHeight: 1.08 }}>
              Điền form đặt trước để Chạm Việt liên hệ lại.
            </Typography>
          </Stack>
          <Stack spacing={2.25}>
            <Stack spacing={1.25}>
              {[
                'Phù hợp làm quà cho bé, lớp học nhỏ hoặc hoạt động gia đình cuối tuần.',
                'Sản phẩm đang ở giai đoạn đặt trước, đội ngũ sẽ xác nhận thời gian giao và số lượng.',
                'Nếu còn băn khoăn về thao tác, hãy xem trang cách chơi; nếu muốn hình dung trải nghiệm, hãy mở bản xem thử.',
              ].map((item) => (
                <Stack key={item} direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ color: 'primary.main', mt: 0.2, display: 'flex' }}>
                    <MessageCircle size={18} />
                  </Box>
                  <Typography sx={{ color: 'var(--text-sub)', fontSize: 15, lineHeight: 1.72 }}>{item}</Typography>
                </Stack>
              ))}
            </Stack>
            <ContactRequestForm
              requestType="preorder_request"
              submitLabel="Gửi yêu cầu đặt trước"
              successMessage="Cảm ơn bạn, Chạm Việt đã nhận yêu cầu đặt trước và sẽ liên hệ sớm."
            />
          </Stack>
        </Box>
      </ContentContainer>
    </PageSection>
  );
}

export default function ProductDetailPage() {
  return (
    <Box sx={{ backgroundColor: 'var(--bg)' }}>
      <ProductHero />
      <ProductIncludedSection />
      <ProductStorySection />
      {/* <ProductHologramSection /> */}
      <ProductEducationSection />
      <PreorderInfoSection />
    </Box>
  );
}
