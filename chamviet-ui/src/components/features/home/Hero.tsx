import { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';
import { useNavigate } from 'react-router-dom';
import { HOME_COPY } from '../../../data/home';

export default function Hero() {
  const cardRef = useSmoothScroll<HTMLDivElement>();
  const [showStickyCtA, setShowStickyCtA] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShowStickyCtA(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToVideo = () => {
    document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div ref={cardRef} className="hero-card scroll-reveal fade-up">
            <div className="hero-card__pattern" />
            
            <div className="hero-card__content">
              <div className="hero-badge hero-badge--light">
                <Sparkles size={13} />
                <span>{HOME_COPY.hero.badge}</span>
              </div>

              <h1 className="hero-card__heading">
                {HOME_COPY.hero.titleStart}
                <span className="hero-card__heading-accent">{HOME_COPY.hero.titleHighlight}</span>
              </h1>

              <p className="hero-card__sub">
                {HOME_COPY.hero.description}
              </p>

              <div className="hero-card__micro-text">
                {HOME_COPY.hero.microText}
              </div>

              <div className="hero-card__ctas">
                <button 
                  className="btn btn-primary hero-card__cta-primary"
                  onClick={() => navigate('/products/banh-chung-banh-day')}
                >
                  <span>{HOME_COPY.hero.primaryCta}</span>
                  <ArrowRight size={18} />
                </button>
                <button className="btn btn-outline hero-card__cta-secondary" onClick={scrollToVideo}>
                  <PlayCircle size={18} />
                  <span>{HOME_COPY.hero.secondaryCta}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY CTA (desktop) ── */}
      <div
        className="hero-sticky-cta"
        style={{
          transform: showStickyCtA ? 'translateY(0)' : 'translateY(108%)',
          opacity: showStickyCtA ? 1 : 0
        }}
      >
        <span className="hero-sticky-cta__label">Chạm Việt – bộ hộp Pepper's Ghost</span>
        <button 
          className="btn btn-primary hero-sticky-cta__btn"
          onClick={() => navigate('/products/banh-chung-banh-day')}
        >
          <span>{HOME_COPY.hero.primaryCta}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}
