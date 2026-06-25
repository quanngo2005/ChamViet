import { Star } from "lucide-react";

import { Reveal, RevealItem, StaggerReveal } from "../../common/MotionReveal";

const testimonials = [
  {
    id: 1,
    name: 'Chị Nguyễn Lan Anh',
    role: 'Phụ huynh · Hà Nội',
    avatar: 'LA',
    quote: 'Con tôi không còn dán mắt vào điện thoại nữa. Thay vào đó, cháu tự lắp ghép hàng giờ rồi gọi cả nhà đến xem câu chuyện hiện lên trong hộp. Đây là món quà ý nghĩa nhất tôi từng tặng cháu.',
    stars: 5,
    product: 'Bộ sư tập: Hào khí Việt Nam'
  },
  {
    id: 2,
    name: 'Thầy Trần Minh Khoa',
    role: 'Giáo viên Tiểu học · Hà Nội',
    avatar: 'MK',
    quote: 'Tôi đã tích hợp Chạm Việt vào giờ học văn hóa. Học sinh hứng thú hơn hẳn. Trải nghiệm sân khấu ảo giúp các em ghi nhớ câu chuyện cổ tích sâu hơn bất kỳ sách giáo khoa nào.',
    stars: 5,
    product: 'Bộ sư tập: Hào khí Việt Nam'
  },
  {
    id: 3,
    name: 'Chị Phạm Thu Hằng',
    role: 'Phụ huynh · Hà Nội',
    avatar: 'TH',
    quote: 'Không ngờ chỉ vài miếng ghép gỗ lại có thể tạo ra trải nghiệm hấp dẫn đến vậy. Các con say sưa lắp ghép và hồi hộp chờ đợi xem câu chuyện hiện lên ra sao. Món quà này thực sự rất ý nghĩa.',
    stars: 5,
    product: 'Bộ sư tập: Hào khí Việt Nam'
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="container">
        {/* Header */}
        <Reveal className="testimonials-section__header">
          <h2 className="testimonials-section__title">
            <span style={{ color: 'var(--primary)' }}>Phụ huynh nói gì sau khi {"Chạm Việt"} đến với gia đình?</span>
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
