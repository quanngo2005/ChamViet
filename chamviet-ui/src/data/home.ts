import heroImage from '@assets/hero.png';
import unboxingFlatlay from '@assets/unboxing-flatlay.png';
import heroChildAr from '@assets/hero-child-ar.png';
import videoThumbnail from '@assets/video-thumbnail.png';

export const HOME_IMAGES = {
  heroImage,
  howToPlay: {
    step1: heroImage,
    step2: videoThumbnail,
    step3: unboxingFlatlay,
    step4: heroChildAr,
  }
};

export const HOME_COPY = {
  hero: {
    badge: 'Bộ sản phẩm kể chuyện văn hóa Việt',
    titleStart: 'Chạm ',
    titleHighlight: 'Việt',
    description: 'Bộ sản phẩm kể chuyện văn hóa Việt bằng tranh lắp ghép, video và hộp Pepper\'s Ghost để tạo hiệu ứng hologram như một sân khấu thu nhỏ.',
    primaryCta: 'Sở hữu bộ sản phẩm',
    secondaryCta: 'Xem câu chuyện',
    microText: 'Tranh lắp ghép | Video kể chuyện | Hộp Pepper\'s Ghost',
    productBadge1: 'Mới',
    productBadge2: 'Bộ Bánh Chưng',
    productTitle: 'Khám phá sự tích Bánh Chưng Bánh Dày',
  },
  learning: {
    title: 'Học Hỏi Qua Mọi Giác Quan',
    description: 'Phương pháp giáo dục đa giác quan kết hợp đồ chơi truyền thống và công nghệ hiện đại giúp trẻ phát triển toàn diện.',
    cards: [
      {
        icon: '👁️',
        title: 'Nhìn',
        color: 'rgba(219, 234, 254, 1)',
        description: 'Hình ảnh dân gian sinh động, màu sắc tươi sáng kích thích thị giác.',
      },
      {
        icon: '👂',
        title: 'Nghe',
        color: 'rgba(217, 164, 65, 0.2)',
        description: 'Giọng kể lôi cuốn, âm nhạc truyền thống qua ứng dụng tương tác.',
      },
      {
        icon: '✋',
        title: 'Chạm',
        color: 'rgba(220, 252, 231, 1)',
        description: 'Chất liệu gỗ tự nhiên an toàn, mang lại cảm giác ấm áp chân thực.',
      },
      {
        icon: '🎮',
        title: 'Chơi',
        color: 'rgba(168, 50, 50, 0.1)',
        description: 'Tương tác sáng tạo, rèn luyện tư duy logic và kỹ năng vận động tinh.',
      },
    ]
  },
  steps: {
    title: 'Hành Trình Trải Nghiệm 4 Bước',
    description: 'Mỗi bước dùng một hình minh họa riêng để người xem hiểu ngay hành động cần làm.',
    items: [
      {
        number: '1',
        title: 'Lắp ghép',
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
        title: 'Quét với AI Vision',
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
        title: 'Đặt lên hộp và xem',
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
        title: 'Hỏi đáp và khám phá',
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
