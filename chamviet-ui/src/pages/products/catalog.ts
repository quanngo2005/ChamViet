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
    collectionLabel: 'Bộ kể chuyện Chạm Việt',
    title: 'Bộ kể chuyện tương tác',
    shortDescription:
      'Một bộ kể chuyện văn hóa Việt gồm 2 tranh ghép gỗ: Sự tích Hồ Gươm và Sự tích Thánh Gióng. Bé ghép tranh, quét tranh nhận diện hình ảnh, xem hiệu ứng phản chiếu 3D và hỏi đáp cùng AI Chíp Bông.',
    badgeLabel: 'Có sẵn 2 tranh',
    reviewsLabel: 'Sẵn sàng mở bán',
    priceLabel: '229.000đ',
    compareAtPriceLabel: '',
    discountLabel: '',
    listAgeLabel: '4-8 tuổi',
    listTopicLabel: 'Truyền thuyết',
    listCardDescription:
      '1 bộ gồm Sự tích Hồ Gươm và Sự tích Thánh Gióng, đi kèm trải nghiệm kể chuyện tương tác.',
  },
];

export function getProductById(productId: string | undefined) {
  if (!productId) return undefined;
  return PRODUCT_CATALOG.find((product) => product.id === productId);
}
