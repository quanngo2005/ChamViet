import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Card, Container, Stack, Typography, Grid, Divider } from '@mui/material';

import heroImage from '@assets/hero.png';

import { getProductById, PRODUCT_CATALOG } from './products/catalog';

const COLORS = {
  primary: '#a83232',
  bg: '#fdfbf7',
  title: '#0f172a',
  muted: '#64748b',
  body: '#334155',
  sand: '#7a5230',
};

const COPY = {
  included: [
    { title: '20 mảnh ghép hình', description: 'Các mảnh gỗ cao cấp với các hoa văn truyền thống được khắc chi tiết bằng laser.' },
    { title: 'Thẻ QR', description: 'Quét thẻ để mở khóa nội dung video hologram' },
    { title: 'Hộp phản chiếu', description: 'Hộp được thiết kế đặc biệt có thể biến thành đế hiển thị holographic.' },
  ],
  story: {
    heading: 'Truyền Thuyết',
    paragraphs: [
      'Trong thời gian trị vì của vị Vua Hùng thứ 6, ông muốn chọn người thừa kế.  Ông đã nói với các con rằng ai mang đến món ăn ngon nhất và ý nghĩa nhất sẽ được truyền ngôi.  Trong khi những người khác tìm kiếm những viên ngọc quý hiếm và thịt lạ, Lang Liêu, hoàng tử thứ 18, đã được một vị thần ghé thăm trong giấc mơ.',
      'Dưới sự hướng dẫn của linh hồn, ông đã tạo ra hai chiếc bánh: một chiếc bánh vuông tượng trưng cho Trái Đất (Bánh Chưng) và một chiếc bánh tròn tượng trưng cho Trời (Bánh Dầy). Câu đố này thể hiện sự hài hòa của thiên nhiên và lòng hiếu thảo, cốt lõi của ngày Tết Việt Nam.',
    ],
  },
  hologram: {
    heading: 'Trải nghiệm phản chiếu hologram',
    description: 'Mang những huyền thoại đến cuộc sống với công nghệ chiếu hình hologram',
    steps: ['Step 1: Assembly', 'Step 2: Scanning', 'Step 3: Placement', 'Step 4: Immerse'],
  },
  sustainability: {
    heading: 'Giá trị bền vững',
    description:
      'Mỗi bộ ghép hình được chế tác từ ván ép bạch dương đạt chứng nhận FSC và được hoàn thiện bằng chất phủ không độc hại, thân thiện với môi trường. Chúng tôi tin vào những món đồ chơi có thể tồn tại qua nhiều thế hệ, giống như những câu chuyện mà chúng kể lại.',
    specs: [
      { label: 'Nguyên Liệu', value: 'Gỗ bạch dương' },
      { label: 'Lứa tuổi', value: '4 - 16 Years' },
      { label: 'Thiết Kế', value: 'Vietnamese Studio' },
      { label: 'Tính an toàn', value: 'ASTM Certified' },
    ],
  },
  education: {
    heading: 'Lợi ích giáo dục',
    items: [
      { title: 'Học hỏi văn hóa', description: 'Đào sâu hiểu biết về các truyền thống và giá trị của người Việt.' },
      { title: 'Fine Motor Skills', description: 'Trò chơi tương tác giúp tăng cường khả năng phối hợp và tư duy không gian.' },
      { title: 'Tích hợp STEM và Nghệ thuật', description: 'Kết hợp hình học, lịch sử và vật lý ánh sáng trong cùng một bộ sản phẩm.' },
    ],
  },
};

function GallerySection({ title }: { title: string }) {
  return (
    <Stack spacing={2.5}>
      <Card
        sx={{
          borderRadius: '8px',
          border: '1px solid rgba(168, 50, 50, 0.05)',
          boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)',
          overflow: 'hidden',
        }}
      >
        <Box component="img" src={heroImage} alt={title} sx={{ width: '100%', height: 534, objectFit: 'cover', display: 'block' }} />
      </Card>

      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid key={index} size={{ xs: 3 }}>
            <Box
              sx={{
                borderRadius: '4px',
                border: index === 0 ? `2px solid ${COLORS.primary}` : '2px solid rgba(168, 50, 50, 0.15)',
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                backgroundColor: '#ffffff',
              }}
            >
              <Box component="img" src={heroImage} alt={`${title} ${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

function QuantitySelector({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <Box
      sx={{
        borderRadius: '12px',
        border: '1px solid rgba(168, 50, 50, 0.20)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        height: 52,
      }}
    >
      <Button
        onClick={() => onChange(Math.max(1, value - 1))}
        sx={{
          minWidth: 52,
          height: 52,
          borderRadius: 0,
          color: COLORS.body,
          fontSize: 20,
          '&:hover': { backgroundColor: 'rgba(168, 50, 50, 0.04)' },
        }}
      >
        -
      </Button>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 700, color: COLORS.title }}>{value}</Typography>
      </Box>
      <Button
        onClick={() => onChange(value + 1)}
        sx={{
          minWidth: 52,
          height: 52,
          borderRadius: 0,
          color: COLORS.body,
          fontSize: 20,
          '&:hover': { backgroundColor: 'rgba(168, 50, 50, 0.04)' },
        }}
      >
        +
      </Button>
    </Box>
  );
}

function IncludedCard({ title, description }: { title: string; description: string }) {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid rgba(168, 50, 50, 0.08)',
        boxShadow: '0px 1px 2px rgba(0,0,0,0.04)',
        p: 3,
        height: '100%',
      }}
    >
      <Stack spacing={1.25}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '16px',
            backgroundColor: 'rgba(217, 164, 65, 0.20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.sand,
            fontSize: 20,
          }}
        >
          ⬡
        </Box>
        <Typography sx={{ fontWeight: 800, color: COLORS.title, fontSize: 16 }}>{title}</Typography>
        <Typography sx={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>{description}</Typography>
      </Stack>
    </Card>
  );
}

function StepCard({ label }: { label: string }) {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(168, 50, 50, 0.08)',
        boxShadow: '0px 1px 2px rgba(0,0,0,0.04)',
        height: '100%',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box component="img" src={heroImage} alt={label} sx={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} />
        <Box
          sx={{
            position: 'absolute',
            left: 16,
            bottom: 16,
            px: 1.5,
            py: 0.75,
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography sx={{ fontWeight: 800, color: COLORS.title, fontSize: 13 }}>{label}</Typography>
        </Box>
      </Box>
    </Card>
  );
}

function EducationItem({ title, description }: { title: string; description: string }) {
  return (
    <Stack direction="row" spacing={2.5} sx={{ alignItems: 'flex-start' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          backgroundColor: 'rgba(253, 251, 247, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fdfbf7',
          flex: '0 0 auto',
        }}
      >
        ✓
      </Box>
      <Stack spacing={0.75}>
        <Typography sx={{ color: '#fdfbf7', fontWeight: 900, fontSize: 16 }}>{title}</Typography>
        <Typography sx={{ color: 'rgba(253, 251, 247, 0.85)', fontSize: 14, lineHeight: 1.7 }}>{description}</Typography>
      </Stack>
    </Stack>
  );
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const product = useMemo(() => getProductById(productId), [productId]);

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Box sx={{ backgroundColor: COLORS.bg, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.title }}>
              Không tìm thấy sản phẩm
            </Typography>
            <Typography sx={{ color: COLORS.muted }}>Sản phẩm này không tồn tại hoặc đã bị thay đổi.</Typography>
            <Box>
              <Button
                variant="contained"
                onClick={() => navigate('/products')}
                sx={{ backgroundColor: COLORS.primary, '&:hover': { backgroundColor: '#8a2828' }, textTransform: 'none', borderRadius: '12px' }}
              >
                Quay lại danh sách
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: COLORS.bg }}>
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                onClick={() => navigate('/products')}
                sx={{ textTransform: 'none', color: COLORS.muted, px: 0, minWidth: 'auto', '&:hover': { backgroundColor: 'transparent', color: COLORS.title } }}
              >
                Sản phẩm
              </Button>
              <Typography sx={{ color: COLORS.muted }}>/</Typography>
              <Typography sx={{ color: COLORS.title, fontWeight: 700 }}>{product.title}</Typography>
            </Stack>

            <Grid container spacing={{ xs: 3, md: 6 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <GallerySection title={product.title} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2.5} sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '999px',
                      backgroundColor: 'rgba(168, 50, 50, 0.06)',
                      width: 'fit-content',
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 800, color: COLORS.primary, letterSpacing: '0.2px' }}>
                      {product.collectionLabel}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: COLORS.title,
                      fontWeight: 900,
                      fontSize: { xs: 34, md: 44 },
                      lineHeight: { xs: '40px', md: '52px' },
                    }}
                  >
                    {product.title}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ color: '#f59e0b', fontWeight: 900, letterSpacing: '-0.5px' }}>★★★★★</Typography>
                    <Typography sx={{ color: COLORS.muted, fontWeight: 600 }}>{product.reviewsLabel}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography sx={{ color: COLORS.primary, fontWeight: 900, fontSize: 28 }}>{product.priceLabel}</Typography>
                    <Typography sx={{ color: COLORS.muted, textDecoration: 'line-through', fontWeight: 700 }}>{product.compareAtPriceLabel}</Typography>
                    <Box sx={{ px: 1, py: 0.5, borderRadius: '8px', backgroundColor: 'rgba(168, 50, 50, 0.10)' }}>
                      <Typography sx={{ color: COLORS.primary, fontWeight: 900, fontSize: 12 }}>{product.discountLabel}</Typography>
                    </Box>
                  </Stack>

                  <Typography sx={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.7 }}>{product.shortDescription}</Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}>
                    <Box sx={{ flex: '0 0 auto', width: { xs: '100%', sm: 220 } }}>
                      <QuantitySelector value={quantity} onChange={setQuantity} />
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        height: 52,
                        borderRadius: '12px',
                        textTransform: 'none',
                        backgroundColor: COLORS.primary,
                        fontWeight: 900,
                        boxShadow:
                          '0px 4px 6px -4px rgba(168, 50, 50, 0.20), 0px 10px 15px -3px rgba(168, 50, 50, 0.20)',
                        '&:hover': { backgroundColor: '#8a2828' },
                      }}
                    >
                      Thêm giỏ hàng
                    </Button>
                  </Stack>

                  <Divider sx={{ borderColor: 'rgba(168, 50, 50, 0.10)' }} />

                  <Grid container spacing={2}>
                    {['Miễn phí giao hàng 2 bộ', 'Đi kèm hướng dẫn sử dụng'].map((text) => (
                      <Grid key={text} size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '12px',
                              backgroundColor: 'rgba(168, 50, 50, 0.06)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: COLORS.primary,
                              flex: '0 0 auto',
                            }}
                          >
                            ✓
                          </Box>
                          <Typography sx={{ color: COLORS.body, fontWeight: 700, fontSize: 13 }}>{text}</Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, borderTop: '1px solid rgba(168, 50, 50, 0.10)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      backgroundColor: 'rgba(217, 164, 65, 0.20)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: COLORS.sand,
                    }}
                  >
                    ✦
                  </Box>
                  <Typography sx={{ fontWeight: 900, color: COLORS.title, fontSize: 26 }}>{COPY.story.heading}</Typography>
                </Stack>
                <Stack spacing={1.5}>
                  {COPY.story.paragraphs.map((p) => (
                    <Typography key={p} sx={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                      {p}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card
                sx={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(168, 50, 50, 0.10)',
                  boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)',
                }}
              >
                <Box component="img" src={heroImage} alt={COPY.story.heading} sx={{ width: '100%', height: 400, objectFit: 'cover', display: 'block' }} />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, borderTop: '1px solid rgba(168, 50, 50, 0.10)' }}>
        <Container maxWidth="lg">
          <Stack spacing={3.5}>
            <Typography sx={{ fontWeight: 900, color: COLORS.title, fontSize: 30 }}>Trong hộp có gì đây ?</Typography>
            <Grid container spacing={3}>
              {COPY.included.map((item) => (
                <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                  <IncludedCard title={item.title} description={item.description} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, borderTop: '1px solid rgba(168, 50, 50, 0.10)' }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={1.25}>
              <Typography sx={{ fontWeight: 900, color: COLORS.title, fontSize: 30 }}>{COPY.hologram.heading}</Typography>
              <Typography sx={{ color: COLORS.muted, fontSize: 15, maxWidth: 720, lineHeight: 1.7 }}>{COPY.hologram.description}</Typography>
            </Stack>

            <Grid container spacing={3}>
              {COPY.hologram.steps.map((step) => (
                <Grid key={step} size={{ xs: 12, sm: 6, md: 3 }}>
                  <StepCard label={step} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, borderTop: '1px solid rgba(168, 50, 50, 0.10)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2.5}>
                <Typography sx={{ fontWeight: 900, color: COLORS.title, fontSize: 30 }}>{COPY.sustainability.heading}</Typography>
                <Typography sx={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.8 }}>{COPY.sustainability.description}</Typography>

                <Grid container spacing={2.5}>
                  {COPY.sustainability.specs.map((spec) => (
                    <Grid key={spec.label} size={{ xs: 12, sm: 6 }}>
                      <Card
                        sx={{
                          borderRadius: '16px',
                          border: '1px solid rgba(168, 50, 50, 0.08)',
                          boxShadow: '0px 1px 2px rgba(0,0,0,0.04)',
                          p: 2.5,
                          height: '100%',
                        }}
                      >
                        <Stack spacing={0.5}>
                          <Typography sx={{ color: COLORS.muted, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                            {spec.label}
                          </Typography>
                          <Typography sx={{ color: COLORS.title, fontSize: 16, fontWeight: 900 }}>{spec.value}</Typography>
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '24px',
                  backgroundColor: COLORS.primary,
                  overflow: 'hidden',
                  p: { xs: 3.5, md: 6 },
                  height: '100%',
                  minHeight: { xs: 360, md: 400 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    left: -40,
                    width: 256,
                    height: 256,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(217, 164, 65, 0.20)',
                    filter: 'blur(64px)',
                    pointerEvents: 'none',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -40,
                    right: -40,
                    width: 256,
                    height: 256,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(217, 164, 65, 0.20)',
                    filter: 'blur(64px)',
                    pointerEvents: 'none',
                  }}
                />

                <Typography sx={{ color: '#fdfbf7', fontWeight: 900, fontSize: 30, position: 'relative' }}>
                  {COPY.education.heading}
                </Typography>

                <Stack spacing={3} sx={{ position: 'relative' }}>
                  {COPY.education.items.map((item) => (
                    <EducationItem key={item.title} title={item.title} description={item.description} />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, borderTop: '1px solid rgba(168, 50, 50, 0.10)' }}>
        <Container maxWidth="lg">
          <Stack spacing={2.5}>
            <Typography sx={{ fontWeight: 900, color: COLORS.title, fontSize: 26 }}>Có thể bạn sẽ thích</Typography>
            <Grid container spacing={3}>
              {PRODUCT_CATALOG.slice(0, 4).map((p) => (
                <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    onClick={() => navigate(`/products/${p.id}`)}
                    sx={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(168, 50, 50, 0.08)',
                      boxShadow: '0px 1px 2px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      '&:hover': { boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.08)' },
                    }}
                  >
                    <Box component="img" src={heroImage} alt={p.title} sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                    <Stack spacing={1} sx={{ p: 2 }}>
                      <Typography sx={{ fontWeight: 900, color: COLORS.title, fontSize: 16, lineHeight: '22px' }}>
                        {p.title}
                      </Typography>
                      <Typography sx={{ color: COLORS.primary, fontWeight: 900 }}>{p.priceLabel}</Typography>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
