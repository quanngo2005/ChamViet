import { useState, useMemo } from 'react';
import { PRODUCT_CATALOG } from '../pages/products/catalog';
import { AGE_FILTERS, TOPIC_FILTERS } from '../data/products';
import type { AgeFilter, TopicFilter } from '../data/products';
import type { Product } from '../types/product';

export function useProductListData() {
  const [age, setAge] = useState<AgeFilter>('Tất cả');
  const [topic, setTopic] = useState<TopicFilter>('Cổ tích');
  const [page, setPage] = useState(1);

  // Map from catalog product to our generic ui Product interface
  const formattedProducts: Product[] = useMemo(() => {
    return PRODUCT_CATALOG.map(p => ({
      id: p.id,
      title: p.title,
      shortDescription: p.listCardDescription,
      priceLabel: p.priceLabel,
      compareAtPriceLabel: p.compareAtPriceLabel,
      discountLabel: p.discountLabel,
      collectionLabel: p.collectionLabel,
      reviewsLabel: p.reviewsLabel,
      badgeLabel: 'Sắp ra mắt',
      ageLabel: p.listAgeLabel,
      topicLabel: p.listTopicLabel,
      image: undefined
    }));
  }, []);

  return {
    filters: {
      ageOptions: AGE_FILTERS,
      topicOptions: TOPIC_FILTERS,
      activeAge: age,
      activeTopic: topic,
      setAge,
      setTopic,
    },
    pagination: {
      currentPage: page,
      totalPages: 3,
      setPage,
    },
    products: formattedProducts,
  };
}
