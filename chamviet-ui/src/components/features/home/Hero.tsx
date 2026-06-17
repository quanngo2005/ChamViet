import { useState } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion, useMotionValueEvent, useSpring, useTransform } from "motion/react";
import { useNavigate } from "react-router-dom";

import { useAppScroll } from "../../../hooks/useAppScroll";
import { HOME_COPY, HOME_IMAGES, HOME_PRODUCT } from "../../../data/home";
import { scrollToSection } from "../../common/LenisProvider";

export default function Hero() {
  const [isStickyInteractive, setIsStickyInteractive] = useState(false);
  const navigate = useNavigate();
  const { scrollY } = useAppScroll();

  const stickyProgress = useTransform(scrollY, [320, 420], [0, 1]);
  const stickyOpacity = useSpring(stickyProgress, {
    damping: 28,
    mass: 0.35,
    stiffness: 280,
  });
  const stickyY = useSpring(useTransform(stickyProgress, [0, 1], [24, 0]), {
    damping: 28,
    mass: 0.35,
    stiffness: 280,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 380;
    setIsStickyInteractive((previous) => (previous === next ? previous : next));
  });

  const scrollToVideo = () => {
    scrollToSection("video-section", 96);
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-section__media" aria-hidden="true">
          <picture>
            <source srcSet={HOME_IMAGES.heroChildArWebp} type="image/webp" />
            <img
              src={HOME_IMAGES.heroChildAr}
              alt=""
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="hero-section__wash" />

        <div className="container hero-section__inner">
          <div className="hero-section__copy">
            <p className="hero-section__kicker">Chạm một câu chuyện - Nhớ một Việt Nam</p>
            <h1 className="hero-card__heading">
              Chạm Việt
            </h1>
            <p className="hero-card__sub">
              Xếp hình tranh gỗ kết hợp 3D và kể chuyện tương tác, giúp bé khám phá những câu chuyện Việt một cách trực quan và thú vị
            </p>
            <div className="hero-card__ctas">
              <button
                className="btn btn-primary hero-card__cta-primary"
                onClick={() => navigate(`/products/${HOME_PRODUCT.id}`)}
                type="button"
              >
                <span>Khám phá ngay</span>
                <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline hero-card__cta-secondary" onClick={scrollToVideo} type="button">
                <PlayCircle size={18} />
                <span>Xem cách hoạt động</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      <motion.div
        className="hero-sticky-cta"
        style={{
          opacity: stickyOpacity,
          pointerEvents: isStickyInteractive ? "auto" : "none",
          y: stickyY,
        }}
        aria-hidden={!isStickyInteractive}
      >
        <span className="hero-sticky-cta__label">Chạm Việt - {HOME_PRODUCT.boxLabel}</span>
        <button
          className="btn btn-primary hero-sticky-cta__btn"
          onClick={() => navigate(`/products/${HOME_PRODUCT.id}`)}
          type="button"
        >
          <span>{HOME_COPY.hero.primaryCta}</span>
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </>
  );
}
