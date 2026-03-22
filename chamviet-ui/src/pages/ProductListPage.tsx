import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Card, Container, IconButton, Stack, Typography, Grid } from '@mui/material';

import heroImage from '@assets/hero.png';

import { PRODUCT_CATALOG } from './products/catalog';

const COLORS = {
  primary: '#a83232',
  bg: '#fdfbf7',
  title: '#0f172a',
  muted: '#64748b',
  body: '#334155',
};

const FIGMA_COPY = {
  heroTitle: 'Gìn giữ nét đẹp văn hóa Việt',
  heroDescription:
    'Mỗi bộ đồ chơi là một câu chuyện cổ tích, một truyền thuyết hào hùng được tái hiện qua những mảnh ghép gỗ mộc mạc, giúp bé vừa chơi vừa học về nguồn cội.',
  product: {
    badge: 'Sắp ra mắt',
    age: '4-6 tuổi',
    topic: 'Cổ tích',
    title: 'Bánh Chưng Bánh Dầy',
    description:
      'Khám phá ý nghĩa của lòng hiếu thảo và\nsự trân trọng hạt gạo quê hương qua b…',
    price: '245.000đ',
  },
};

const AGE_FILTERS = ['Tất cả', 'Dưới 4 tuổi', '4-6 tuổi', '6-8 tuổi', 'Trên 8 tuổi'] as const;
const TOPIC_FILTERS = ['Cổ tích', 'Thần thoại', 'Lịch sử', 'Lễ hội'] as const;

type AgeFilter = (typeof AGE_FILTERS)[number];
type TopicFilter = (typeof TOPIC_FILTERS)[number];

function FiltersSection() {
  const [age, setAge] = useState<AgeFilter>('Tất cả');
  const [topic, setTopic] = useState<TopicFilter>('Cổ tích');

  const ChipButton = ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <Button
      onClick={onClick}
      disableElevation
      sx={{
        borderRadius: '8px',
        px: 2.5,
        py: 1,
        minHeight: 36,
        textTransform: 'none',
        fontSize: 14,
        fontWeight: 500,
        backgroundColor: selected ? COLORS.primary : 'rgba(168, 50, 50, 0.05)',
        color: selected ? '#ffffff' : COLORS.body,
        '&:hover': {
          backgroundColor: selected ? '#8a2828' : 'rgba(168, 50, 50, 0.08)',
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <Box sx={{ py: { xs: 4, md: 5 }, backgroundColor: COLORS.bg }}>
      <Container maxWidth="lg">
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            sx={{ alignItems: { xs: 'flex-start', md: 'center' }, flexWrap: 'wrap' }}
          >
            <Typography sx={{ color: COLORS.muted, fontWeight: 600, fontSize: 14 }}>
              Độ tuổi:
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
              {AGE_FILTERS.map((item) => (
                <ChipButton
                  key={item}
                  label={item}
                  selected={item === age}
                  onClick={() => setAge(item)}
                />
              ))}
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            sx={{ alignItems: { xs: 'flex-start', md: 'center' }, flexWrap: 'wrap' }}
          >
            <Typography sx={{ color: COLORS.muted, fontWeight: 600, fontSize: 14 }}>
              Chủ đề:
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
              {TOPIC_FILTERS.map((item) => (
                <ChipButton
                  key={item}
                  label={item}
                  selected={item === topic}
                  onClick={() => setTopic(item)}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function ProductsHeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: COLORS.bg,
        py: { xs: 6, md: 8 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          background:
            'radial-gradient(circle at top left, rgba(168, 50, 50, 1) 0%, rgba(168, 50, 50, 0) 60%)',
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Stack spacing={2}>
          <Typography
            variant="h4"
            sx={{
              color: COLORS.title,
              fontWeight: 900,
              fontSize: { xs: 30, md: 36 },
              lineHeight: { xs: '36px', md: '40px' },
            }}
          >
            {FIGMA_COPY.heroTitle}
          </Typography>
          <Typography sx={{ color: COLORS.muted, fontSize: 18, maxWidth: 760, lineHeight: 1.6 }}>
            {FIGMA_COPY.heroDescription}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function ProductCard({
  productId,
  onOpen,
}: {
  productId: string;
  onOpen: (id: string) => void;
}) {
  return (
    <Card
      onClick={() => onOpen(productId)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen(productId);
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
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={heroImage}
          alt={FIGMA_COPY.product.title}
          sx={{ width: '100%', height: 278, objectFit: 'cover', display: 'block' }}
        />

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
              color: COLORS.primary,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              lineHeight: '15px',
            }}
          >
            {FIGMA_COPY.product.badge}
          </Typography>
        </Box>

        <IconButton
          aria-label="Yêu thích"
          onClick={(event) => event.stopPropagation()}
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
          <Box
            sx={{
              px: 1,
              py: '2px',
              borderRadius: '12px',
              backgroundColor: 'rgba(168, 50, 50, 0.10)',
            }}
          >
            <Typography sx={{ color: COLORS.primary, fontWeight: 700, fontSize: 10 }}>
              {FIGMA_COPY.product.age}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1,
              py: '2px',
              borderRadius: '12px',
              backgroundColor: '#f1f5f9',
            }}
          >
            <Typography sx={{ color: COLORS.muted, fontWeight: 700, fontSize: 10 }}>
              {FIGMA_COPY.product.topic}
            </Typography>
          </Box>
        </Stack>

        <Typography sx={{ color: COLORS.title, fontWeight: 700, fontSize: 18, lineHeight: '28px' }}>
          {FIGMA_COPY.product.title}
        </Typography>

        <Typography
          sx={{
            color: COLORS.muted,
            fontSize: 12,
            lineHeight: '16px',
            whiteSpace: 'pre-line',
          }}
        >
          {FIGMA_COPY.product.description}
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: COLORS.primary, fontWeight: 700, fontSize: 18, lineHeight: '28px' }}>
            {FIGMA_COPY.product.price}
          </Typography>

          <IconButton
            aria-label="Thêm vào giỏ"
            onClick={(event) => event.stopPropagation()}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              backgroundColor: COLORS.primary,
              color: '#ffffff',
              boxShadow:
                '0px 4px 6px -4px rgba(168, 50, 50, 0.20), 0px 10px 15px -3px rgba(168, 50, 50, 0.20)',
              '&:hover': { backgroundColor: '#8a2828' },
            }}
          >
            🛒
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  );
}

function PaginationSection() {
  const [page, setPage] = useState(1);

  const PageButton = ({ value }: { value: number }) => {
    const selected = value === page;
    return (
      <Button
        onClick={() => setPage(value)}
        sx={{
          minWidth: 40,
          height: 40,
          borderRadius: '8px',
          textTransform: 'none',
          fontSize: 16,
          fontWeight: selected ? 700 : 400,
          backgroundColor: selected ? COLORS.primary : 'transparent',
          color: selected ? '#ffffff' : COLORS.muted,
          border: selected ? '1px solid transparent' : '1px solid rgba(168, 50, 50, 0.20)',
          '&:hover': {
            backgroundColor: selected ? '#8a2828' : 'rgba(168, 50, 50, 0.04)',
          },
        }}
      >
        {value}
      </Button>
    );
  };

  const ArrowButton = ({ direction }: { direction: 'prev' | 'next' }) => (
    <IconButton
      aria-label={direction === 'prev' ? 'Trang trước' : 'Trang sau'}
      onClick={() => setPage((p) => Math.max(1, Math.min(3, p + (direction === 'prev' ? -1 : 1))))}
      sx={{
        width: 40,
        height: 40,
        borderRadius: '8px',
        border: '1px solid rgba(168, 50, 50, 0.20)',
        color: COLORS.muted,
      }}
    >
      {direction === 'prev' ? '‹' : '›'}
    </IconButton>
  );

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, backgroundColor: COLORS.bg }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <ArrowButton direction="prev" />
          <PageButton value={1} />
          <PageButton value={2} />
          <PageButton value={3} />
          <Typography sx={{ color: COLORS.muted, px: 1, fontSize: 16 }}>...</Typography>
          <ArrowButton direction="next" />
        </Stack>
      </Container>
    </Box>
  );
}

export default function ProductListPage() {
  const navigate = useNavigate();
  const products = useMemo(() => PRODUCT_CATALOG, []);

  return (
    <Box sx={{ backgroundColor: COLORS.bg }}>
      <ProductsHeroSection />
      <FiltersSection />

      <Box sx={{ py: { xs: 4, md: 5 }, backgroundColor: COLORS.bg }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard productId={product.id} onOpen={(id) => navigate(`/products/${id}`)} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <PaginationSection />
    </Box>
  );
}
