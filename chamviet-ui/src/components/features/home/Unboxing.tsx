import { Package, CreditCard, Palette, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSmoothScroll, useSmoothScrollStagger } from '../../../hooks/useSmoothScroll';
import unboxingImage from '../../../assets/unboxing-flatlay.png';

const contents = [
  {
    id: 1,
    title: '02 Bộ Puzzle Gỗ 3D',
    description: 'Chế tác từ gỗ tự nhiên cao cấp, bề mặt nhẵn mịn, in UV bền màu, an toàn tuyệt đối cho trẻ.',
    icon: <Package size={22} />,
    tag: '01'
  },
  {
    id: 2,
    title: 'Kính phản chiếu (Pepper\'s Ghost)',
    description: 'Tấm kính mica trong suốt đi kèm để bạn lắp ráp thành sân khấu nhỏ phản chiếu hình ảnh.',
    icon: <Palette size={22} />,
    tag: '02'
  },
  {
    id: 3,
    title: 'Mã QR & Thẻ câu chuyện',
    description: 'Quét mã QR để mở video câu chuyện cổ tích, kết hợp với hộp kính để xem nhân vật nổi lên.',
    icon: <CreditCard size={22} />,
    tag: '03'
  }
];

export default function Unboxing() {
  const textRef = useSmoothScroll<HTMLDivElement>();
  const listRef = useSmoothScrollStagger<HTMLDivElement>('.list-item', 150);
  const imageRef = useSmoothScroll<HTMLDivElement>();

  return (
    <section className="unboxing-section">
      <div className="container">
        <div className="unboxing-section__grid">

          {/* ── LEFT: Flat-lay Image ── */}
          <div
            ref={imageRef}
            className="unboxing-section__image-wrap scroll-reveal fade-left"
          >
            <div className="unboxing-section__image-glow" />
            <div className="unboxing-section__image-frame">
              <img
                src={unboxingImage}
                alt="Trọn bộ sản phẩm Chạm Việt: puzzle gỗ, sách hướng dẫn, mã kích hoạt"
                className="unboxing-section__img"
              />
            </div>
          </div>

          {/* ── RIGHT: Content ── */}
          <div
            ref={textRef}
            className="unboxing-section__content scroll-reveal fade-right"
          >
            {/* Eyebrow */}
            <p className="section-eyebrow">Có gì trong hộp?</p>

            <h2 className="unboxing-section__title">
              Mở hộp —<br />
              <span style={{ color: 'var(--primary)' }}>Cả thế giới bên trong</span>
            </h2>
            <p className="unboxing-section__sub">
              Mỗi chi tiết được thiết kế tỉ mỉ để tạo ra trải nghiệm phygital hoàn hảo.
            </p>

            {/* Item list */}
            <div ref={listRef} className="unboxing-section__list">
              {contents.map((item) => (
                <div
                  key={item.id}
                  className="list-item unboxing-item scroll-reveal-child fade-up"
                >
                  <div className="unboxing-item__tag">{item.tag}</div>
                  <div className="unboxing-item__body">
                    <div className="unboxing-item__icon">{item.icon}</div>
                    <div>
                      <h4 className="unboxing-item__title">{item.title}</h4>
                      <p className="unboxing-item__desc">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
            <button className="btn btn-primary unboxing-section__cta">
              <span>Đặt hàng ngay</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
