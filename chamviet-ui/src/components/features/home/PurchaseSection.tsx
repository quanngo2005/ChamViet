import { ShoppingBag } from 'lucide-react';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';
import { Link } from 'react-router-dom';

export default function PurchaseSection() {
  const contentRef = useSmoothScroll<HTMLDivElement>();

  return (
    <section className="purchase-section scroll-reveal fade-up" ref={contentRef}>
      <div className="container purchase-section__container">
        <div className="purchase-section__card">
          <p className="purchase-section__eyebrow">Sẵn sàng mở hộp?</p>
          <h2 className="purchase-section__title">
            Khám phá câu chuyện Bánh Chưng Bánh Dày<br />qua một sân khấu nhỏ trên tay
          </h2>
          <Link to="/products/banh-chung-banh-day" className="btn purchase-section__cta">
            <ShoppingBag size={20} />
            <span>Sở hữu bộ sản phẩm</span>
          </Link>
          <div className="purchase-section__pattern" />
        </div>
      </div>
    </section>
  );
}
