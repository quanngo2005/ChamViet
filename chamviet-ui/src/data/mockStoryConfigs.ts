import type { StoryConfig } from "./video-story-qa";

export const MOCK_STORY_CONFIGS: Record<string, StoryConfig> = {
  "su-tich-ho-guom": {
    videoId: "lct-uiT1PRw",
    videoUrl: "https://youtu.be/lct-uiT1PRw",
    storyTitle: "Sự tích Hồ Gươm",
    childAge: 4,
    pieceCount: 30,
    storyContent:
      "Sự tích Hồ Gươm kể về Lê Lợi và nghĩa quân Lam Sơn trong cuộc kháng chiến chống quân Minh. Nhờ thanh gươm thần do Long Quân ban tặng, nghĩa quân đã giành thắng lợi, đất nước trở lại hòa bình. Sau đó, vua Lê Lợi trả lại thanh gươm cho Rùa Vàng trên hồ Tả Vọng, từ đó hồ được gọi là Hồ Hoàn Kiếm hay Hồ Gươm.",
    qaList: [
      {
        question:
          "Trong câu chuyện Sự tích Hồ Gươm, ai là người đã đứng lên lãnh đạo nghĩa quân đánh đuổi quân Minh để cứu đất nước?",
        answer:
          "Người đã đứng lên lãnh đạo nghĩa quân đánh đuổi quân Minh là Lê Lợi. Ông là thủ lĩnh của cuộc khởi nghĩa Lam Sơn, một người yêu nước, dũng cảm và quyết tâm giành lại độc lập cho dân tộc. Nhờ tài lãnh đạo cùng sự giúp đỡ của thanh gươm thần, Lê Lợi đã đưa nghĩa quân chiến thắng quân Minh và mang lại hòa bình cho đất nước.",
      },
      {
        question:
          "Chú Lê Thận đã tìm thấy vật gì đặc biệt khi kéo lưới dưới sông?",
        answer:
          "Khi kéo lưới nhiều lần trên sông, Lê Thận đã tìm thấy một lưỡi gươm kỳ lạ. Ban đầu anh tưởng đó chỉ là một thanh sắt cũ nên đã ném xuống nước. Tuy nhiên, thanh sắt ấy liên tục xuất hiện trong lưới khiến anh tò mò mang về nhà. Sau này mọi người mới biết đó chính là phần lưỡi của thanh gươm thần mà Long Quân ban cho nghĩa quân Lam Sơn.",
      },
      {
        question:
          "Nhờ có thanh gươm thần, nghĩa quân của vua Lê Lợi đã làm được điều gì?",
        answer:
          "Sau khi có được thanh gươm thần hoàn chỉnh, nghĩa quân Lam Sơn như được tiếp thêm sức mạnh. Họ chiến đấu dũng cảm, liên tiếp giành thắng lợi trong nhiều trận đánh lớn. Cuối cùng nghĩa quân đã đánh bại hoàn toàn quân Minh xâm lược, giải phóng đất nước và đem lại cuộc sống bình yên cho nhân dân.",
      },
      {
        question:
          "Sau khi đất nước hòa bình, ai đã xuất hiện trên mặt hồ để xin lại thanh gươm thần?",
        answer:
          "Sau khi đất nước được độc lập và nhân dân sống trong hòa bình, khi vua Lê Lợi đang đi thuyền trên hồ Tả Vọng thì một con Rùa Vàng, còn gọi là Rùa Thần, nổi lên giữa mặt hồ. Rùa Thần thay mặt Long Quân đến xin nhà vua hoàn trả lại thanh gươm thần đã giúp đánh thắng giặc ngoại xâm.",
      },
      {
        question:
          "Vì sao hồ Tả Vọng sau này được gọi là Hồ Hoàn Kiếm hay Hồ Gươm?",
        answer:
          "Hồ Tả Vọng được đổi tên thành Hồ Hoàn Kiếm, hay còn gọi là Hồ Gươm, vì đây là nơi vua Lê Lợi đã trao trả lại thanh gươm thần cho Rùa Vàng theo lệnh của Long Quân. Tên gọi Hoàn Kiếm có nghĩa là 'trả lại kiếm', nhằm ghi nhớ sự kiện đặc biệt này và ca ngợi chiến thắng bảo vệ đất nước của dân tộc Việt Nam.",
      },
    ],
  },
};

export function getMockStoryConfig(slug: string): StoryConfig | null {
  return MOCK_STORY_CONFIGS[slug] ?? null;
}

export function getMockStoryConfigByVideoId(videoId: string): StoryConfig | null {
  for (const config of Object.values(MOCK_STORY_CONFIGS)) {
    if (config.videoId === videoId) {
      return config;
    }
  }
  return null;
}

export function getFirstMockStoryConfig(): StoryConfig | null {
  return Object.values(MOCK_STORY_CONFIGS)[0] ?? null;
}
