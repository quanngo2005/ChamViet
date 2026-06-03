import { ImagePlus } from 'lucide-react';
import { HOME_PRODUCT } from '../../../data/home';
import { useSmoothScrollStagger } from '../../../hooks/useSmoothScroll';

export default function IncludedPaintings() {
  const cardsRef = useSmoothScrollStagger<HTMLDivElement>('.included-painting-card', 130);

  return (
    <section className="included-paintings-section">
      <div className="container">
        <div className="included-paintings-section__header scroll-reveal fade-up">
          <p className="section-eyebrow">Có trong hộp</p>
          <h2 className="included-paintings-section__title">Hai tranh đã sẵn sàng để mở truyện</h2>
          <p className="included-paintings-section__sub">
            Khu vực ảnh dưới đây đang để placeholder để bạn tự cập nhật hình thật của từng tranh.
          </p>
        </div>

        <div ref={cardsRef} className="included-paintings-section__grid">
          {HOME_PRODUCT.paintings.map((painting) => (
            <article key={painting.id} className="included-painting-card scroll-reveal-child fade-up">
              <div className="included-painting-card__media" aria-label={`Placeholder ảnh ${painting.title}`}>
                <div className="included-painting-card__placeholder">
                  <ImagePlus size={34} />
                  <span>Placeholder ảnh</span>
                </div>
                <span className="included-painting-card__badge">{painting.status}</span>
              </div>
              <div className="included-painting-card__body">
                <h3 className="included-painting-card__title">{painting.title}</h3>
                <p className="included-painting-card__desc">{painting.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
