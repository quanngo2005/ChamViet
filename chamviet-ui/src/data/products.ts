export const PRODUCTS_HERO_COPY = {
  heroTitle: 'Gìn giữ nét đẹp văn hóa Việt',
  heroDescription:
    'Mỗi bộ đồ chơi là một câu chuyện cổ tích, một truyền thuyết hào hùng được tái hiện qua những mảnh ghép gỗ mộc mạc, giúp bé vừa chơi vừa học về nguồn cội.',
};

export const AGE_FILTERS = ['Tất cả', 'Dưới 4 tuổi', '4-6 tuổi', '6-8 tuổi', 'Trên 8 tuổi'] as const;
export const TOPIC_FILTERS = ['Cổ tích', 'Thần thoại', 'Lịch sử', 'Lễ hội'] as const;

export type AgeFilter = (typeof AGE_FILTERS)[number];
export type TopicFilter = (typeof TOPIC_FILTERS)[number];
