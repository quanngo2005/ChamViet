import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowRight, MessageCircle } from 'lucide-react';

import {
  ProductEducationSection,
  ProductGallerySection,
  ProductStorySection,
} from '../components/features/productDetail';
import { ContentContainer, PageSection } from '../components/common/layout';
import ContactRequestForm from '../components/common/ContactRequestForm';
import { HOME_IMAGES, HOME_PRODUCT } from '../data/home';
import type { Product } from '../types/product';

const PREORDER_PRODUCT: Product = {
  id: HOME_PRODUCT.id,
  title: HOME_PRODUCT.boxLabel,
  collectionLabel: 'Bộ sư tập: Xếp hình tranh gỗ - xem video 3D - tương tác & hỏi đáp cùng AI - khám phá văn hóa Việt',
  priceLabel: HOME_PRODUCT.price,
  reviewsLabel: 'Dành cho gia đình yêu văn hóa Việt',
  shortDescription:
    "BST “Hào khí việt nam” bao gồm: 2 tranh ghép câu chuyện thánh gióng & hồ gươm, hộp chiếu 3D hologram, 2 video tương tác, AI Chíp Bông tương tác & hỏi đáp cùng bé, 2 phần quà bí mật, Gắn kết gia đình",
  badgeLabel: 'Đặt trước',
  image: HOME_IMAGES.unboxingFlatlayWebp,
};

const PREORDER_FACEBOOK_URL = 'https://www.facebook.com/chammotcauchuyen';
const PREORDER_EMAIL = 'motvietnam@chamviet.com.vn';

function ProductHero({ onOpenContactDialog }: { onOpenContactDialog: () => void }) {
  return (
    <PageSection
      sx={{
        py: { xs: 7, md: 12 },
        background:
          'radial-gradient(circle at 12% 18%, rgba(198, 40, 40, 0.10), transparent 28%), linear-gradient(180deg, #fdfbf7 0%, #f5efe6 100%)',
      }}
    >
      <ContentContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.05fr) minmax(360px, 0.95fr)' },
            gap: { xs: 4.5, md: 8 },
            alignItems: 'center',
          }}
        >
          <ProductGallerySection title={PREORDER_PRODUCT.title} />

          <Stack spacing={3.25}>
            <Stack spacing={1.35}>


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

              <Box sx={{ color: 'var(--text-sub)', fontSize: { xs: 16, md: 18 }, lineHeight: 1.78 }}>
                <Typography sx={{ fontSize: 'inherit', fontWeight: 700, mb: 1, color: 'var(--text-h)' }}>
                  BST “Hào khí Việt Nam” bao gồm:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 3, listStyleType: 'disc' }}>
                  <Typography component="li" sx={{ fontSize: 'inherit', mb: 0.5 }}>2 tranh ghép câu chuyện Thánh Gióng & Hồ Gươm</Typography>
                  <Typography component="li" sx={{ fontSize: 'inherit', mb: 0.5 }}>Hộp chiếu 3D hologram</Typography>
                  <Typography component="li" sx={{ fontSize: 'inherit', mb: 0.5 }}>2 Video tương tác</Typography>
                  <Typography component="li" sx={{ fontSize: 'inherit', mb: 0.5 }}>AI Chíp Bông tương tác & hỏi đáp cùng bé</Typography>
                  <Typography component="li" sx={{ fontSize: 'inherit', mb: 0.5 }}>2 phần quà bí mật</Typography>
                  <Typography component="li" sx={{ fontSize: 'inherit' }}>Gắn kết gia đình</Typography>
                </Box>
              </Box>
            </Stack>


            <Typography sx={{ color: 'primary.main', fontSize: { xs: 34, md: 40 }, fontWeight: 950 }}>
              {PREORDER_PRODUCT.priceLabel}
            </Typography>



            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
              <Button
                onClick={onOpenContactDialog}
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
                  transition: 'background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 22px 38px rgba(168, 50, 50, 0.28)',
                  },
                  '&:focus-visible': {
                    outline: '3px solid rgba(168, 50, 50, 0.30)',
                    outlineOffset: 2,
                  },
                }}
              >
                Mua ngay
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
                  transition: 'background-color 180ms ease, border-color 180ms ease, transform 180ms ease',
                  '&:hover': {
                    borderColor: 'rgba(168, 50, 50, 0.42)',
                    backgroundColor: 'rgba(168, 50, 50, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                  '&:focus-visible': {
                    outline: '3px solid rgba(168, 50, 50, 0.22)',
                    outlineOffset: 2,
                  },
                }}
              >
                Xem cách chơi
              </Button>
            </Stack>
          </Stack>
        </Box>
      </ContentContainer>
    </PageSection>
  );
}

function PreorderContactDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: { xs: 1, sm: 1.5 },
          background: 'linear-gradient(180deg, #fffdf9 0%, #f7efe5 100%)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, color: 'var(--text-h)', fontSize: 24, fontWeight: 950 }}>
        Liên hệ đặt trước
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, pt: '12px !important', pb: 1 }}>
        <Stack spacing={2.5}>
          <Typography sx={{ color: 'var(--text-sub)', fontSize: 15, lineHeight: 1.72 }}>
            Để lại thông tin để đội ngũ Chạm\u00A0Việt gửi mail xác nhận và tư vấn đặt trước.
          </Typography>

          <ContactRequestForm
            requestType="preorder_request"
            submitLabel="Gửi yêu cầu đặt trước"
            successMessage="Chạm\u00A0Việt đã nhận thông tin đặt trước và sẽ phản hồi qua email."
          />

          <Stack spacing={1.25}>
            <Typography sx={{ color: 'var(--text-sub)', fontSize: 13.5, fontWeight: 800 }}>
              Hoặc liên hệ nhanh qua kênh khác
            </Typography>
            <Button
              component="a"
              href={PREORDER_FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              variant="contained"
              disableElevation
              sx={{
                minHeight: 52,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: 15,
                fontWeight: 900,
                backgroundColor: '#1877F2',
                transition: 'background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  backgroundColor: '#1664d9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 14px 28px rgba(24, 119, 242, 0.22)',
                },
                '&:focus-visible': {
                  outline: '3px solid rgba(24, 119, 242, 0.28)',
                  outlineOffset: 2,
                },
              }}
            >
              Liên hệ qua Facebook
            </Button>

            <Button
              component="a"
              href={`mailto:${PREORDER_EMAIL}`}
              variant="outlined"
              sx={{
                minHeight: 52,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: 15,
                fontWeight: 850,
                color: 'primary.main',
                borderColor: 'rgba(168, 50, 50, 0.24)',
                transition: 'background-color 180ms ease, border-color 180ms ease, transform 180ms ease',
                '&:hover': {
                  borderColor: 'rgba(168, 50, 50, 0.42)',
                  backgroundColor: 'rgba(168, 50, 50, 0.05)',
                  transform: 'translateY(-2px)',
                },
                '&:focus-visible': {
                  outline: '3px solid rgba(168, 50, 50, 0.22)',
                  outlineOffset: 2,
                },
              }}
            >
              Gửi mail tới {PREORDER_EMAIL}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: 'var(--text-sub)',
            fontWeight: 800,
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function PreorderInfoSection() {
  return (
    <PageSection sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fffaf0' }}>
      <ContentContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.84fr 1.16fr' },
            gap: { xs: 3, md: 5 },
            alignItems: 'center',
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
              Để lại nhu cầu, Chạm\u00A0Việt sẽ tư vấn phiên bản phù hợp.
            </Typography>
          </Stack>
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
        </Box>
      </ContentContainer>
    </PageSection>
  );
}

export default function ProductDetailPage() {
  const [isPreorderDialogOpen, setIsPreorderDialogOpen] = useState(false);

  return (
    <Box sx={{ backgroundColor: 'var(--bg)' }}>
      <ProductHero onOpenContactDialog={() => setIsPreorderDialogOpen(true)} />
      <ProductStorySection />
      <ProductEducationSection />
      <PreorderInfoSection />
      <PreorderContactDialog open={isPreorderDialogOpen} onClose={() => setIsPreorderDialogOpen(false)} />
    </Box>
  );
}
