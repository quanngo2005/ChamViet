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
    id: 'box-tuong-tac-ke-chuyen',
    collectionLabel: 'Chạm Việt Box',
    title: 'Box tương tác kể chuyện',
    shortDescription:
      'Một box kể chuyện văn hóa Việt gồm 2 tranh lắp ghép: Sự tích Hồ Gươm và Sự tích Thánh Gióng. Bé lắp tranh, quét QR, xem hiệu ứng Pepper\'s Ghost và tiếp tục hỏi đáp sau câu chuyện.',
    badgeLabel: 'Có sẵn 2 tranh',
    reviewsLabel: 'Sẵn sàng mở bán',
    priceLabel: '229.000đ',
    compareAtPriceLabel: '',
    discountLabel: '',
    listAgeLabel: '4-8 tuổi',
    listTopicLabel: 'Truyền thuyết',
    listCardDescription:
      '1 box gồm Sự tích Hồ Gươm và Sự tích Thánh Gióng, đi kèm trải nghiệm kể chuyện tương tác.',
  },
];

export function getProductById(productId: string | undefined) {
  if (!productId) return undefined;
  return PRODUCT_CATALOG.find((product) => product.id === productId);
}
