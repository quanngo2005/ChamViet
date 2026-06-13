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
  boxLabel: 'Bộ kể chuyện tương tác',
  paintings: [
    {
      id: 'ho-guom',
      title: 'Sự tích Hồ Gươm',
      description: 'Cùng bé khám phá thanh gươm thần, vua Lê Lợi và biểu tượng hồ Hoàn Kiếm.',
      status: 'Có trong bộ',
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
    badge: 'Tranh ghép gỗ + Hộp phản chiếu 3D + Hỏi đáp cùng AI Chíp Bông',
    titleStart: 'Chạm ',
    titleHighlight: 'Việt',
    description: 'Một hộp chơi để bé tự tay ghép tranh, xem câu chuyện Việt hiện lên và hỏi thêm điều mình tò mò sau khi xem xong.',
    primaryCta: HOME_PRODUCT.ctaLabel,
    secondaryCta: 'Xem thử 30s',
    microText: 'Tranh ghép gỗ | Video kể chuyện | Hộp phản chiếu 3D',
    productBadge1: 'Mới',
    productBadge2: HOME_PRODUCT.boxLabel,
    productTitle: 'Khám phá Sự tích Hồ Gươm và Sự tích Thánh Gióng',
  },
  learning: {
    title: 'Tại sao nên mua?',
    description: 'Phần này chỉ giữ lại lý do phụ huynh nên chọn Chạm Việt, không lặp lại hướng dẫn chơi hay giới thiệu từng chủ đề.',
    cards: [
      {
        icon: 'hands',
        title: 'Tự tay hoàn thành',
        color: 'rgba(139, 94, 60, 0.1)',
        description: 'Tranh ghép gỗ giúp bé tập trung, kiên nhẫn và có cảm giác tự hào khi hoàn thành tranh.',
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
        description: 'Hỏi đáp cùng AI Chíp Bông giúp bé nhớ nhân vật, sự kiện và ý nghĩa câu chuyện lâu hơn.',
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
    description: 'Xem nhanh hành trình bé sẽ đi qua trước khi mở hộp thật tại nhà.',
    items: [
      {
        number: '1',
        title: 'Bé tự tay ghép tranh',
        description: 'Các mảnh gỗ ghép vào nhau để dần hiện ra bức tranh văn hóa.',
        screenLabel: 'Ghép tranh gỗ',
        image: 'https://storage.googleapis.com/chamviet-media-bucket-2026/demo01.png',
        alt: 'Các mảnh tranh gỗ đang được ghép',
        accentColor: 'var(--secondary)',
        variant: 'puzzle',
        fallbackLabel: 'Xem trước ghép tranh gỗ',
      },
      {
        number: '2',
        title: 'Quét tranh trên website',
        description: 'Đưa điện thoại vào màn hình quét của website để nhận diện hình ảnh bức tranh đã hoàn thành.',
        screenLabel: 'Nhận diện hình ảnh',
        image: 'https://storage.googleapis.com/chamviet-media-bucket-2026/scanner.png',
        alt: 'Điện thoại đang quét bức tranh ghép gỗ đã hoàn thiện',
        accentColor: 'var(--primary)',
        variant: 'scanner',
        fallbackLabel: 'Khung xem trước thao tác quét',
      },
      {
        number: '3',
        title: 'Xem sân khấu nhỏ',
        description: 'Đặt điện thoại lên hộp phản chiếu 3D để câu chuyện hiện lên như sân khấu nhỏ.',
        screenLabel: 'Hộp phản chiếu 3D',
        image: 'https://storage.googleapis.com/chamviet-media-bucket-2026/3d.png',
        alt: 'Điện thoại được đặt lên hộp phản chiếu 3D',
        accentColor: 'var(--accent-color)',
        variant: 'ghost',
        fallbackLabel: 'Khung xem trước hộp phản chiếu 3D',
      },
      {
        number: '4',
        title: 'Hỏi đáp với Chíp Bông',
        description: 'Đặt câu hỏi để khám phá câu chuyện qua giao diện trò chuyện AI Chíp Bông.',
        screenLabel: 'Hỏi đáp với Chíp Bông',
        image: HOME_IMAGES.howToPlay.step4,
        alt: 'Bé đang hỏi đáp trong giao diện trò chuyện AI Chíp Bông',
        accentColor: 'var(--text-h)',
        variant: 'qa',
        fallbackLabel: 'Khung xem trước hỏi đáp tương tác',
      },
    ]
  }
};
