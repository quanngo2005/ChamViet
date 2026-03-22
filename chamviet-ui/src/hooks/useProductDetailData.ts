import { useMemo, useState } from 'react';
import { getProductById, PRODUCT_CATALOG } from '../pages/products/catalog';

export function useProductDetailData(productId: string | undefined) {
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => getProductById(productId), [productId]);
  
  // Convert basic catalog to full Product object for related display
  const relatedProducts = useMemo(() => {
    return PRODUCT_CATALOG.slice(0, 4).map(p => ({
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
    product,
    quantity,
    setQuantity,
    relatedProducts,
  };
}
