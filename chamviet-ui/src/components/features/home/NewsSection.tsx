import { ArrowRight } from 'lucide-react';
import { useSmoothScrollStagger } from '../../../hooks/useSmoothScroll';

const news = [
  {
    id: 1,
    title: 'Bánh Chưng Bánh Dày và bài học về lòng hiếu thảo',
    excerpt: 'Cùng con khám phá ý nghĩa sâu xa đằng sau sự tích ra đời của hai loại bánh truyền thống.',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850d0d7?auto=format&fit=crop&q=80&w=400',
    date: '10 Tháng 4, 2024'
  },
  {
    id: 2,
    title: 'Pepper\'s Ghost là gì?',
    excerpt: 'Tìm hiểu về kỹ thuật ảo ảnh quang học hàng trăm năm tuổi được ứng dụng trong hộp phản chiếu Chạm Việt.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400',
    date: '05 Tháng 4, 2024'
  },
  {
    id: 3,
    title: 'Biến câu chuyện dân gian thành trải nghiệm gia đình',
    excerpt: 'Cách công nghệ và đồ chơi vật lý giúp kết nối các thế hệ thông qua những câu chuyện cổ.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400',
    date: '01 Tháng 4, 2024'
  }
];

export default function NewsSection() {
  const cardsRef = useSmoothScrollStagger<HTMLDivElement>('.news-card', 150);

  return (
    <section className="news-section">
      <div className="container">
        <div className="news-section__header scroll-reveal fade-up">
          <p className="section-eyebrow">Tin tức & Bài viết</p>
          <h2 className="news-section__title">Góc chia sẻ</h2>
        </div>

        <div ref={cardsRef} className="news-section__grid">
          {news.map((item) => (
            <div key={item.id} className="news-card scroll-reveal-child fade-up">
              <div className="news-card__image-wrap">
                <img src={item.image} alt={item.title} className="news-card__image" />
              </div>
              <div className="news-card__content">
                <p className="news-card__date">{item.date}</p>
                <h3 className="news-card__title">{item.title}</h3>
                <p className="news-card__excerpt">{item.excerpt}</p>
                <button className="news-card__readmore">
                  Đọc tiếp <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
