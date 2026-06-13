import { ImagePlus } from "lucide-react";

import { Reveal, RevealItem, StaggerReveal } from "../../common/MotionReveal";
import { HOME_PRODUCT } from "../../../data/home";

export default function IncludedPaintings() {
  return (
    <section className="included-paintings-section">
      <div className="container">
        <Reveal className="included-paintings-section__header">
          <p className="section-eyebrow">Có trong hộp</p>
          <h2 className="included-paintings-section__title">Hai tranh đã sẵn sàng để mở truyện</h2>
          <p className="included-paintings-section__sub">
            Khu vực ảnh dưới đây đang để placeholder để bạn tự cập nhật hình thật của từng tranh.
          </p>
        </Reveal>

        <StaggerReveal className="included-paintings-section__grid">
          {HOME_PRODUCT.paintings.map((painting) => (
            <RevealItem key={painting.id} as="article" className="included-painting-card">
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
            </RevealItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
