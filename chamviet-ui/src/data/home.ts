import heroImage from '@assets/hero.png';
import unboxingFlatlay from '@assets/unboxing-flatlay.png';
import unboxingFlatlayWebp from '@assets/unboxing-flatlay.webp';
import heroChildAr from '@assets/hero-child-ar.png';
import heroChildArWebp from '@assets/hero-child-ar.webp';
import videoThumbnail from '@assets/video-thumbnail.png';
import videoThumbnailWebp from '@assets/video-thumbnail.webp';

export const HOME_IMAGES = {
  heroImage,
  heroChildAr,
  heroChildArWebp,
  videoThumbnail,
  videoThumbnailWebp,
  unboxingFlatlay,
  unboxingFlatlayWebp,
  howToPlay: {
    step1: heroImage,
    step2: videoThumbnailWebp,
    step3: unboxingFlatlayWebp,
    step4: heroChildArWebp,
  }
};

export const HOME_PRODUCT = {
  id: 'box-tuong-tac-ke-chuyen',
  price: '229.000đ',
  ctaLabel: 'Mua ngay - 229.000đ',
  boxLabel: 'Box tương tác kể chuyện',
  paintings: [
    {
      id: 'ho-guom',
      title: 'Sự tích Hồ Gươm',
      description: 'Cùng bé khám phá thanh gươm thần, vua Lê Lợi và biểu tượng hồ Hoàn Kiếm.',
      status: 'Có trong hộp',
    },
    {
      id: 'thanh-giong',
      title: 'Sự tích Thánh Gióng',
      description: 'Theo chân cậu bé làng Gióng vươn mình thành tráng sĩ bảo vệ quê hương.',
      status: 'Có trong hộp',
    },
  ],
};

export const HOME_COPY = {
  hero: {
    badge: 'Puzzle gỗ + hologram + AI hỏi đáp',
    titleStart: 'Chạm ',
    titleHighlight: 'Việt',
    description: 'Bé lắp tranh gỗ, quét QR, đặt điện thoại lên hộp phản chiếu để xem câu chuyện hiện lên như sân khấu nhỏ, rồi hỏi AI để hiểu thêm.',
    primaryCta: HOME_PRODUCT.ctaLabel,
    secondaryCta: 'Xem demo 30s',
    microText: 'Tranh lắp ghép | Video kể chuyện | Hộp Pepper\'s Ghost',
    productBadge1: 'Mới',
    productBadge2: HOME_PRODUCT.boxLabel,
    productTitle: 'Khám phá Sự tích Hồ Gươm và Sự tích Thánh Gióng',
  },
  learning: {
    title: 'Tại sao nên mua?',
    description: 'Một box nhỏ gọn nhưng đủ để bé tự làm, tự xem và tự kể lại câu chuyện Việt theo cách của mình.',
    cards: [
      {
        icon: 'hands',
        title: 'Tự tay hoàn thành',
        color: 'rgba(139, 94, 60, 0.1)',
        description: 'Puzzle gỗ giúp bé tập trung, kiên nhẫn và có cảm giác tự hào khi hoàn thành tranh.',
      },
      {
        icon: 'stage',
        title: 'Xem chuyện hiện lên',
        color: 'rgba(198, 40, 40, 0.08)',
        description: 'Hộp phản chiếu biến điện thoại thành sân khấu nhỏ, dễ hiểu ngay khi đặt lên hộp.',
      },
      {
        icon: 'qa',
        title: 'Hỏi tiếp sau khi xem',
        color: 'rgba(212, 175, 55, 0.14)',
        description: 'AI hỏi đáp giúp bé nhớ nhân vật, sự kiện và ý nghĩa câu chuyện lâu hơn.',
      },
      {
        icon: 'gift',
        title: 'Quà tặng có chiều sâu',
        color: 'rgba(78, 52, 46, 0.08)',
        description: 'Phù hợp làm quà cho bé và cũng là cách gia đình cùng nói chuyện về văn hóa Việt.',
      },
    ]
  },
  steps: {
    title: 'Trải nghiệm 4 bước',
    description: 'Vuốt từng bước trên điện thoại để thấy hành trình từ lắp ghép đến hỏi đáp.',
    items: [
      {
        number: '1',
        title: 'Bé tự tay lắp ghép',
        description: 'Các mảnh gỗ ghép vào nhau để dần hiện ra bức tranh văn hóa.',
        screenLabel: 'Lắp ghép puzzle',
        image: HOME_IMAGES.howToPlay.step1,
        alt: 'Các mảnh puzzle gỗ đang được lắp ghép',
        accentColor: 'var(--secondary)',
        variant: 'puzzle',
        fallbackLabel: 'Xem trước lắp ghép puzzle',
      },
      {
        number: '2',
        title: 'Quét tranh bằng AI',
        description: 'Đưa điện thoại vào màn hình quét của web để nhận diện bức tranh đã hoàn thành.',
        screenLabel: 'AI Vision',
        image: HOME_IMAGES.howToPlay.step2,
        alt: 'Điện thoại đang quét bức tranh puzzle đã hoàn thiện',
        accentColor: 'var(--primary)',
        variant: 'scanner',
        fallbackLabel: 'Khung xem trước thao tác quét',
      },
      {
        number: '3',
        title: 'Xem sân khấu nhỏ',
        description: 'Đặt điện thoại lên hộp Pepper\'s Ghost để hiệu ứng phản chiếu hiện lên rõ hơn.',
        screenLabel: 'Pepper Ghost',
        image: HOME_IMAGES.howToPlay.step3,
        alt: 'Điện thoại được đặt lên hộp Pepper Ghost',
        accentColor: 'var(--accent-color)',
        variant: 'ghost',
        fallbackLabel: 'Khung xem trước chiếu Pepper Ghost',
      },
      {
        number: '4',
        title: 'Hỏi thêm cùng AI',
        description: 'Đặt câu hỏi để khám phá câu chuyện qua giao diện trò chuyện AI tương tác.',
        screenLabel: 'Hỏi đáp',
        image: HOME_IMAGES.howToPlay.step4,
        alt: 'Bé đang hỏi đáp trong giao diện trò chuyện tương tác',
        accentColor: 'var(--text-h)',
        variant: 'qa',
        fallbackLabel: 'Khung xem trước hỏi đáp tương tác',
      },
    ]
  }
};
