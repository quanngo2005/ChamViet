import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ContentContainer, GridWrapper, PageSection } from '../../common/layout';
import { ProductCard } from '../../common/ui';
import { PRODUCT_DETAIL_COPY } from '../../../data/productDetail';
import type { Product } from '../../../types/product';

export interface ProductRelatedSectionProps {
  products: Product[];
}

export function ProductRelatedSection({ products }: ProductRelatedSectionProps) {
  const navigate = useNavigate();
  const { related } = PRODUCT_DETAIL_COPY;

  return (
    <PageSection sx={{ py: { xs: 6, md: 10 } }}>
      <ContentContainer>
        <Stack spacing={4}>
          <Typography sx={{ fontWeight: 700, color: 'grey.900', fontSize: 30, textAlign: 'center' }}>
            {related.heading}
          </Typography>
          <GridWrapper spacing={3}>
            {products.map((p) => (
              <Box key={p.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                <ProductCard product={p} onOpen={(id: string) => navigate(`/products/${id}`)} />
              </Box>
            ))}
          </GridWrapper>
        </Stack>
      </ContentContainer>
    </PageSection>
  );
}
