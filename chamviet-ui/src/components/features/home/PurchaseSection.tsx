import { Explore } from '@mui/icons-material';
import { Link } from "react-router-dom";

import { Reveal } from "../../common/MotionReveal";
import { HOME_PRODUCT } from "../../../data/home";

export default function PurchaseSection() {
  return (
    <Reveal as="section" className="purchase-section">
      <div className="container purchase-section__container">
        <div className="purchase-section__card">
          <h2 className="purchase-section__title">
            Bạn đã sẵn sàng cùng con chạm vào một Việt Nam sống động hay chưa?
          </h2>
          <p className="purchase-section__description">
            Từ những mảnh ghép đầu tiên đến khoảnh khắc truyền thuyết hiện lên trước mắt, mỗi trải nghiệm đều giúp trẻ khám phá văn hóa Việt theo cách tự nhiên và đầy hứng thú.
          </p>
          <Link to={`/products/${HOME_PRODUCT.id}`} className="btn purchase-section__cta">
            <Explore style={{ fontSize: 20 }} />
            <span>Khám phá ngay</span>
          </Link>
          <div className="purchase-section__pattern" />
        </div>
      </div>
    </Reveal>
  );
}
