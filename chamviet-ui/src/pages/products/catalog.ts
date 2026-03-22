export type Product = {
  id: string;
  collectionLabel: string;
  title: string;
  shortDescription: string;
  badgeLabel: string;
  reviewsLabel: string;
  priceLabel: string;
  compareAtPriceLabel: string;
  discountLabel: string;
  listAgeLabel: string;
  listTopicLabel: string;
  listCardDescription: string;
};

export const PRODUCT_CATALOG: Product[] = [
  {
    id: 'banh-chung-banh-day',
    collectionLabel: 'Heritage Collection',
    title: 'Bánh Chưng Bánh Dầy Puzzle',
    shortDescription:
      'Trải nghiệm huyền thoại về Hoàng tử Lang Liêu qua bộ xếp hình bằng gỗ thủ công này. Một hành trình xúc giác kết hợp thần thoại Việt Nam cổ xưa với cách kể chuyện tương tác hiện đại.',
    badgeLabel: 'SAVE 25%',
    reviewsLabel: '(48 Reviews)',
    priceLabel: '$300.000 VNĐ',
    compareAtPriceLabel: '$59.00',
    discountLabel: 'SAVE 25%',
    listAgeLabel: '4-6 tuổi',
    listTopicLabel: 'Cổ tích',
    listCardDescription:
      'Khám phá ý nghĩa của lòng hiếu thảo và\nsự trân trọng hạt gạo quê hương qua b…',
  },
  {
    id: 'banh-chung-banh-day-02',
    collectionLabel: 'Heritage Collection',
    title: 'Bánh Chưng Bánh Dầy Puzzle',
    shortDescription:
      'Trải nghiệm huyền thoại về Hoàng tử Lang Liêu qua bộ xếp hình bằng gỗ thủ công này. Một hành trình xúc giác kết hợp thần thoại Việt Nam cổ xưa với cách kể chuyện tương tác hiện đại.',
    badgeLabel: 'SAVE 25%',
    reviewsLabel: '(48 Reviews)',
    priceLabel: '$300.000 VNĐ',
    compareAtPriceLabel: '$59.00',
    discountLabel: 'SAVE 25%',
    listAgeLabel: '4-6 tuổi',
    listTopicLabel: 'Cổ tích',
    listCardDescription:
      'Khám phá ý nghĩa của lòng hiếu thảo và\nsự trân trọng hạt gạo quê hương qua b…',
  },
  {
    id: 'banh-chung-banh-day-03',
    collectionLabel: 'Heritage Collection',
    title: 'Bánh Chưng Bánh Dầy Puzzle',
    shortDescription:
      'Trải nghiệm huyền thoại về Hoàng tử Lang Liêu qua bộ xếp hình bằng gỗ thủ công này. Một hành trình xúc giác kết hợp thần thoại Việt Nam cổ xưa với cách kể chuyện tương tác hiện đại.',
    badgeLabel: 'SAVE 25%',
    reviewsLabel: '(48 Reviews)',
    priceLabel: '$300.000 VNĐ',
    compareAtPriceLabel: '$59.00',
    discountLabel: 'SAVE 25%',
    listAgeLabel: '4-6 tuổi',
    listTopicLabel: 'Cổ tích',
    listCardDescription:
      'Khám phá ý nghĩa của lòng hiếu thảo và\nsự trân trọng hạt gạo quê hương qua b…',
  },
  {
    id: 'banh-chung-banh-day-04',
    collectionLabel: 'Heritage Collection',
    title: 'Bánh Chưng Bánh Dầy Puzzle',
    shortDescription:
      'Trải nghiệm huyền thoại về Hoàng tử Lang Liêu qua bộ xếp hình bằng gỗ thủ công này. Một hành trình xúc giác kết hợp thần thoại Việt Nam cổ xưa với cách kể chuyện tương tác hiện đại.',
    badgeLabel: 'SAVE 25%',
    reviewsLabel: '(48 Reviews)',
    priceLabel: '$300.000 VNĐ',
    compareAtPriceLabel: '$59.00',
    discountLabel: 'SAVE 25%',
    listAgeLabel: '4-6 tuổi',
    listTopicLabel: 'Cổ tích',
    listCardDescription:
      'Khám phá ý nghĩa của lòng hiếu thảo và\nsự trân trọng hạt gạo quê hương qua b…',
  },
  {
    id: 'banh-chung-banh-day-05',
    collectionLabel: 'Heritage Collection',
    title: 'Bánh Chưng Bánh Dầy Puzzle',
    shortDescription:
      'Trải nghiệm huyền thoại về Hoàng tử Lang Liêu qua bộ xếp hình bằng gỗ thủ công này. Một hành trình xúc giác kết hợp thần thoại Việt Nam cổ xưa với cách kể chuyện tương tác hiện đại.',
    badgeLabel: 'SAVE 25%',
    reviewsLabel: '(48 Reviews)',
    priceLabel: '$300.000 VNĐ',
    compareAtPriceLabel: '$59.00',
    discountLabel: 'SAVE 25%',
    listAgeLabel: '4-6 tuổi',
    listTopicLabel: 'Cổ tích',
    listCardDescription:
      'Khám phá ý nghĩa của lòng hiếu thảo và\nsự trân trọng hạt gạo quê hương qua b…',
  },
  {
    id: 'banh-chung-banh-day-06',
    collectionLabel: 'Heritage Collection',
    title: 'Bánh Chưng Bánh Dầy Puzzle',
    shortDescription:
      'Trải nghiệm huyền thoại về Hoàng tử Lang Liêu qua bộ xếp hình bằng gỗ thủ công này. Một hành trình xúc giác kết hợp thần thoại Việt Nam cổ xưa với cách kể chuyện tương tác hiện đại.',
    badgeLabel: 'SAVE 25%',
    reviewsLabel: '(48 Reviews)',
    priceLabel: '$300.000 VNĐ',
    compareAtPriceLabel: '$59.00',
    discountLabel: 'SAVE 25%',
    listAgeLabel: '4-6 tuổi',
    listTopicLabel: 'Cổ tích',
    listCardDescription:
      'Khám phá ý nghĩa của lòng hiếu thảo và\nsự trân trọng hạt gạo quê hương qua b…',
  },
];

export function getProductById(productId: string | undefined) {
  if (!productId) return undefined;
  return PRODUCT_CATALOG.find((product) => product.id === productId);
}

