import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ContentContainer } from '../components/common/layout';
import { ProductCard, Pagination } from '../components/common/ui';
import { ProductsHeroSection, ProductsFiltersSection } from '../components/features/products';
import { useProductListData } from '../hooks/useProductListData';
import { PRODUCTS_HERO_COPY } from '../data/products';

export default function ProductListPage() {
  const navigate = useNavigate();
  const { filters, pagination, products } = useProductListData();

  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <ProductsHeroSection 
        title={PRODUCTS_HERO_COPY.heroTitle} 
        description={PRODUCTS_HERO_COPY.heroDescription} 
      />
      
      <ProductsFiltersSection 
        ageOptions={filters.ageOptions}
        topicOptions={filters.topicOptions}
        activeAge={filters.activeAge}
        activeTopic={filters.activeTopic}
        onAgeChange={filters.setAge}
        onTopicChange={filters.setTopic}
      />

      <Box sx={{ py: { xs: 4, md: 5 }, backgroundColor: 'background.default' }}>
        <ContentContainer>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 4,
            }}
          >
            {products.map((product) => (
              <Box key={product.id}>
                <ProductCard product={product} onOpen={(id) => navigate(`/products/${id}`)} />
              </Box>
            ))}
          </Box>
        </ContentContainer>
      </Box>

      <Pagination 
        page={pagination.currentPage} 
        totalPages={pagination.totalPages} 
        onChange={pagination.setPage} 
      />
    </Box>
  );
}
