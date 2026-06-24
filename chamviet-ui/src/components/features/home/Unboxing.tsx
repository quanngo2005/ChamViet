import { Package, CreditCard, Palette, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Reveal, RevealItem, StaggerReveal } from "../../common/MotionReveal";
import unboxingImage from "../../../assets/unboxing-flatlay.png";
import { HOME_PRODUCT } from "../../../data/home";

const contents = [
  {
    id: 1,
    title: '02 tranh ghép gỗ',
    description: 'Bao gồm Sự tích Hồ Gươm và Sự tích Thánh Gióng, sẵn sàng để bé ghép tranh và mở truyện.',
    icon: <Package size={22} />,
    tag: '01'
  },
  {
    id: 2,
    title: 'Hộp phản chiếu 3D',
    description: 'Tấm kính mica trong suốt đi kèm để bạn lắp ráp thành sân khấu nhỏ phản chiếu hình ảnh.',
    icon: <Palette size={22} />,
    tag: '02'
  },
  {
    id: 3,
    title: 'Nội dung câu chuyện',
    description: 'Quét tranh để mở video câu chuyện văn hóa, kết hợp với hộp phản chiếu 3D để xem nhân vật hiện lên.',
    icon: <CreditCard size={22} />,
    tag: '03'
  }
];

export default function Unboxing() {
  return (
    <section className="unboxing-section">
      <div className="container">
        <div className="unboxing-section__grid">

          {/* ── LEFT: Flat-lay Image ── */}
          <Reveal
            className="unboxing-section__image-wrap"
            variant="left"
          >
            <div className="unboxing-section__image-glow" />
            <div className="unboxing-section__image-frame">
              <img
                src={unboxingImage}
                alt="Trọn bộ sản phẩm Chạm\u00A0Việt: tranh ghép gỗ, sách hướng dẫn, mã kích hoạt"
                className="unboxing-section__img"
              />
            </div>
          </Reveal>

          {/* ── RIGHT: Content ── */}
          <Reveal
            className="unboxing-section__content"
            variant="right"
          >
            {/* Eyebrow */}
            <p className="section-eyebrow">Có gì trong hộp?</p>

            <h2 className="unboxing-section__title">
              Mở hộp:<br />
              <span style={{ color: 'var(--primary)' }}>2 tranh trong 1 bộ</span>
            </h2>
            <p className="unboxing-section__sub">
              Mỗi chi tiết được thiết kế để phụ huynh hiểu ngay trong hộp có gì và bé sẽ bắt đầu chơi như thế nào.
            </p>

            {/* Item list */}
            <StaggerReveal className="unboxing-section__list">
              {contents.map((item) => (
                <RevealItem
                  key={item.id}
                  className="list-item unboxing-item"
                >
                  <div className="unboxing-item__tag">{item.tag}</div>
                  <div className="unboxing-item__body">
                    <div className="unboxing-item__icon">{item.icon}</div>
                    <div>
                      <h4 className="unboxing-item__title">{item.title}</h4>
                      <p className="unboxing-item__desc">{item.description}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </StaggerReveal>

            {/* Trust chips */}
            <div className="unboxing-section__chips">
              <div className="chip chip--green">
                <ShieldCheck size={15} />
                <span>Gỗ tự nhiên an toàn</span>
              </div>
              <div className="chip chip--red">
                <Palette size={15} />
                <span>In UV bền màu</span>
              </div>
            </div>

            {/* CTA */}
            <Link to={`/products/${HOME_PRODUCT.id}`} className="btn btn-primary unboxing-section__cta">
              <span>{HOME_PRODUCT.ctaLabel}</span>
              <ArrowRight size={16} />
            </Link>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
