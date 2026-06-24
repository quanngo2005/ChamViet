import { Link } from "react-router-dom";

import { Reveal } from "../../common/MotionReveal";
import { HOME_PRODUCT } from "../../../data/home";
import "./PurchaseSection.scss";
// ─── Sub-components ──────────────────────────────────────────────────────────

function CornerDecoration() {
  return (
    <svg viewBox="0 0 88 88" fill="none" aria-hidden="true">
      <path
        d="M6 82 L6 6 L82 6"
        stroke="#D4943A"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M18 82 L18 18 L82 18"
        stroke="#D4943A"
        strokeWidth={1}
        strokeLinecap="round"
      />
      <circle cx={6} cy={6} r={3} fill="#D4943A" />
      <path d="M6 36 Q14 24 22 36 Q14 30 6 36Z" fill="#D4943A" />
      <path d="M36 6 Q24 14 36 22 Q30 14 36 6Z" fill="#D4943A" />
    </svg>
  );
}

function DrumPattern() {
  const cx = 200;
  const cy = 200;
  const c = "#FDF0D0";

  const circles = [195, 178, 158, 138, 118, 98, 78, 58, 40, 26, 14].map(
    (r, i) => (
      <circle
        key={r}
        cx={cx}
        cy={cy}
        r={r}
        stroke={c}
        strokeWidth={i % 2 === 0 ? 2 : 0.8}
        fill="none"
      />
    )
  );

  const innerSpokes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return (
      <line
        key={i}
        x1={cx + 26 * Math.cos(a)}
        y1={cy + 26 * Math.sin(a)}
        x2={cx + 58 * Math.cos(a)}
        y2={cy + 58 * Math.sin(a)}
        stroke={c}
        strokeWidth={1.5}
      />
    );
  });

  const outerSpokes = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    return (
      <line
        key={i}
        x1={cx + 78 * Math.cos(a)}
        y1={cy + 78 * Math.sin(a)}
        x2={cx + 118 * Math.cos(a)}
        y2={cy + 118 * Math.sin(a)}
        stroke={c}
        strokeWidth={1}
      />
    );
  });

  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={cx + 178 * Math.cos(a)}
        y1={cy + 178 * Math.sin(a)}
        x2={cx + 195 * Math.cos(a)}
        y2={cy + 195 * Math.sin(a)}
        stroke={c}
        strokeWidth={1.5}
      />
    );
  });

  const ringDots = Array.from({ length: 20 }, (_, i) => {
    const a = (i / 20) * Math.PI * 2;
    return (
      <circle
        key={i}
        cx={cx + 138 * Math.cos(a)}
        cy={cy + 138 * Math.sin(a)}
        r={2.5}
        fill={c}
      />
    );
  });

  const starPoints = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 13 : 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

  return (
    <svg
      className="purchase-section__drum"
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
    >
      {circles}
      {innerSpokes}
      {outerSpokes}
      {ticks}
      {ringDots}
      <polygon points={starPoints} fill={c} />
      <circle cx={cx} cy={cy} r={3} fill={c} />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PurchaseSection() {
  return (
    <Reveal as="section" className="purchase-section">
      <div className="container purchase-section__container">
        <div className="purchase-section__card">

          {/* Hoa văn trống đồng */}
          <DrumPattern />

          {/* Trang trí bốn góc */}
          <span className="purchase-section__corner purchase-section__corner--tl">
            <CornerDecoration />
          </span>
          <span className="purchase-section__corner purchase-section__corner--tr">
            <CornerDecoration />
          </span>
          <span className="purchase-section__corner purchase-section__corner--bl">
            <CornerDecoration />
          </span>
          <span className="purchase-section__corner purchase-section__corner--br">
            <CornerDecoration />
          </span>

          {/* Nội dung */}
          <div className="purchase-section__content">
            <div className="purchase-section__eyebrow">
              <span className="purchase-section__eyebrow-line" />
              <span>Văn hóa Việt Nam</span>
              <span className="purchase-section__eyebrow-line" />
            </div>

            <h2 className="purchase-section__title">
              Bạn đã sẵn sàng cùng con chạm vào một{" "}
              <em className="purchase-section__title-em">Việt Nam sống động</em>{" "}
              hay chưa?
            </h2>

            <div className="purchase-section__divider" aria-hidden="true">
              <span className="purchase-section__divider-line" />
              <span className="purchase-section__divider-dot" />
              <span className="purchase-section__divider-dot purchase-section__divider-dot--bright" />
              <span className="purchase-section__divider-dot" />
              <span className="purchase-section__divider-line" />
            </div>

            <p className="purchase-section__description">
              Từ những mảnh ghép đầu tiên đến khoảnh khắc truyền thuyết hiện
              lên trước mắt, mỗi trải nghiệm đều giúp trẻ khám phá văn hóa
              Việt theo cách tự nhiên và đầy hứng thú.
            </p>

            <Link
              to={`/products/${HOME_PRODUCT.id}`}
              className="purchase-section__cta"
            >
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={1.8} />
                <path
                  d="M12 8l4 4-4 4M8 12h8"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Khám phá ngay</span>
            </Link>
          </div>

        </div>
      </div>
    </Reveal>
  );
}