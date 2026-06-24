import { Reveal, RevealItem, StaggerReveal } from "../../common/MotionReveal";

const news = [
  {
    id: 1,
    title: 'Sự tích Hồ Gươm và biểu tượng của Hà Nội',
    excerpt: 'Cùng con khám phá thanh gươm thần, vua Lê Lợi và câu chuyện gắn với hồ Hoàn Kiếm.',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850d0d7?auto=format&fit=crop&q=80&w=400',
    date: '10 Tháng 4, 2024'
  },
  {
    id: 2,
    title: 'Hộp phản chiếu 3D hoạt động như thế nào?',
    excerpt: 'Tìm hiểu về kỹ thuật phản chiếu ánh sáng hàng trăm năm tuổi được ứng dụng trong hộp phản chiếu Chạm\u00A0Việt.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400',
    date: '05 Tháng 4, 2024'
  },
  {
    id: 3,
    title: 'Sự tích Thánh Gióng qua trải nghiệm gia đình',
    excerpt: 'Cách tranh lắp ghép và kể chuyện tương tác giúp bé hiểu lòng dũng cảm bằng trải nghiệm gần gũi.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400',
    date: '01 Tháng 4, 2024'
  }
];

export default function NewsSection() {
  return (
    <section className="news-section">
      <div className="container">
        <Reveal className="news-section__header">
          <p className="section-eyebrow">Tin tức & Bài viết</p>
          <h2 className="news-section__title">Góc chia sẻ</h2>
        </Reveal>

        <StaggerReveal className="news-section__grid">
          {news.map((item) => (
            <RevealItem key={item.id} className="news-card">
              <div className="news-card__image-wrap">
                <img src={item.image} alt={item.title} className="news-card__image" />
              </div>
              <div className="news-card__content">
                <p className="news-card__date">{item.date}</p>
                <h3 className="news-card__title">{item.title}</h3>
                <p className="news-card__excerpt">{item.excerpt}</p>
              </div>
            </RevealItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
