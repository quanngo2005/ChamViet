import { ShoppingBag } from 'lucide-react';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';
import { Link } from 'react-router-dom';
import { HOME_PRODUCT } from '../../../data/home';

export default function PurchaseSection() {
  const contentRef = useSmoothScroll<HTMLDivElement>();

  return (
    <section className="purchase-section scroll-reveal fade-up" ref={contentRef}>
      <div className="container purchase-section__container">
        <div className="purchase-section__card">
          <p className="purchase-section__eyebrow">Sẵn sàng mở hộp?</p>
          <h2 className="purchase-section__title">
            Sẵn sàng cho Sự tích Hồ Gươm và Sự tích Thánh Gióng<br />trong một box
          </h2>
          <Link to={`/products/${HOME_PRODUCT.id}`} className="btn purchase-section__cta">
            <ShoppingBag size={20} />
            <span>{HOME_PRODUCT.ctaLabel}</span>
          </Link>
          <div className="purchase-section__pattern" />
        </div>
      </div>
    </section>
  );
}
