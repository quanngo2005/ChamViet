import { useEffect, useState } from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HOME_COPY, HOME_IMAGES, HOME_PRODUCT } from '../../../data/home';
import heroChildAr from '../../../assets/hero-child-ar.png';

export default function Hero() {
  const [showStickyCtA, setShowStickyCtA] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShowStickyCtA(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToVideo = () => {
    document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-section__media" aria-hidden="true">
          <img src={heroChildAr} alt="" />
        </div>
        <div className="hero-section__wash" />

        <div className="container hero-section__inner">
          <div className="hero-section__copy">
            <p className="hero-section__kicker">Puzzle gỗ. Hộp phản chiếu. Câu chuyện Việt.</p>
            <h1 className="hero-card__heading">
              Một hộp chơi để bé chạm, xem và hỏi về văn hóa Việt.
            </h1>
            <p className="hero-card__sub">
              {HOME_COPY.hero.description}
            </p>
            <div className="hero-card__ctas">
              <button
                className="btn btn-primary hero-card__cta-primary"
                onClick={() => navigate(`/products/${HOME_PRODUCT.id}`)}
                type="button"
              >
                <span>{HOME_COPY.hero.primaryCta}</span>
                <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline hero-card__cta-secondary" onClick={scrollToVideo} type="button">
                <PlayCircle size={18} />
                <span>{HOME_COPY.hero.secondaryCta}</span>
              </button>
            </div>
          </div>

          <button className="hero-demo" onClick={scrollToVideo} type="button">
            <img
              src={HOME_IMAGES.videoThumbnail}
              alt="Demo cách đặt điện thoại lên hộp phản chiếu để xem câu chuyện"
              className="hero-demo__image"
            />
            <span className="hero-demo__overlay">
              <span className="hero-demo__play">
                <PlayCircle size={42} />
              </span>
              <span className="hero-demo__label">Xem hộp hoạt động</span>
            </span>
          </button>
        </div>
      </section>

      <div
        className="hero-sticky-cta"
        style={{
          transform: showStickyCtA ? 'translateY(0)' : 'translateY(108%)',
          opacity: showStickyCtA ? 1 : 0,
        }}
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
      </div>
    </>
  );
}
