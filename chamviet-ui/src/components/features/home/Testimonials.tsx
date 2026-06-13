import { Star } from "lucide-react";

import { Reveal, RevealItem, StaggerReveal } from "../../common/MotionReveal";

const testimonials = [
  {
    id: 1,
    name: 'Chị Nguyễn Lan Anh',
    role: 'Phụ huynh · Hà Nội',
    avatar: 'LA',
    quote: 'Con tôi không còn dán mắt vào điện thoại nữa. Thay vào đó, cháu tự lắp ghép hàng giờ rồi gọi cả nhà đến xem câu chuyện hiện lên trong hộp kính. Đây là món quà ý nghĩa nhất tôi từng tặng cháu.',
    stars: 5,
    product: 'Chạm Việt Box 2 Tranh'
  },
  {
    id: 2,
    name: 'Thầy Trần Minh Khoa',
    role: 'Giáo viên Tiểu học · Đà Nẵng',
    avatar: 'MK',
    quote: 'Tôi đã tích hợp Chạm Việt vào giờ học văn hóa. Học sinh hứng thú hơn hẳn. Trải nghiệm sân khấu ảo giúp các em ghi nhớ câu chuyện cổ tích sâu hơn bất kỳ sách giáo khoa nào.',
    stars: 5,
    product: 'Sự tích Thánh Gióng'
  },
  {
    id: 3,
    name: 'Chị Phạm Thu Hằng',
    role: 'Phụ huynh · TP.HCM',
    avatar: 'TH',
    quote: 'Chất lượng gỗ rất tốt, bề mặt mịn không lo trầy tay bé. Hộp phản chiếu kết hợp video rất mượt, và bé nhà tôi đã học được rất nhiều về văn hóa Việt Nam một cách vui vẻ.',
    stars: 5,
    product: 'Sự tích Hồ Gươm'
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="container">
        {/* Header */}
        <Reveal className="testimonials-section__header">
          <p className="testimonials-section__eyebrow">Phụ huynh nói gì?</p>
          <h2 className="testimonials-section__title">
            Phản hồi từ phụ huynh<br />
            <span style={{ color: 'var(--primary)' }}>trải nghiệm thử</span>
          </h2>
        </Reveal>

        {/* Cards */}
        <StaggerReveal className="testimonials-section__grid">
          {testimonials.map((t) => (
            <RevealItem key={t.id} className="testimonial-card">
              {/* Stars */}
              <div className="testimonial-card__stars">
                {Array.from({ length: t.stars }, (_, starIndex) => `${t.id}-star-${starIndex + 1}`).map((starKey) => (
                  <Star key={starKey} size={14} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="testimonial-card__quote">
                "{t.quote}"
              </blockquote>

              {/* Product tag */}
              <p className="testimonial-card__product">{t.product}</p>

              {/* Author */}
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">{t.avatar}</div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
