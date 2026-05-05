import { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle, Sparkles, Star } from 'lucide-react';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';
import heroImage from '../../../assets/hero-child-ar.png';

export default function Hero() {
  const textRef = useSmoothScroll<HTMLDivElement>();
  const imageRef = useSmoothScroll<HTMLDivElement>({ threshold: 0.1 });
  const [showStickyCtA, setShowStickyCtA] = useState(false);

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
        <div className="hero-section__inner container">
          {/* ── LEFT: Text + CTA ── */}
          <div ref={textRef} className="hero-section__text scroll-reveal fade-left">
            {/* Badge */}
            <div className="hero-badge">
              <Sparkles size={13} />
              <span>Trải nghiệm văn hóa đa giác quan</span>
            </div>

            <h1 className="hero-section__heading">
              Chạm vào cổ tích —<br />
              <span className="hero-section__heading-accent">Đánh thức giác quan</span>
            </h1>

            <p className="hero-section__sub">
              Đồ chơi gỗ truyền thống kết hợp AR &amp; AI tương tác. Khơi dậy tình yêu văn hóa Việt trong mỗi đứa trẻ từ 6–10 tuổi.
            </p>

            {/* Social proof mini-row */}
            <div className="hero-section__proof">
              <div className="hero-section__proof-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>
              <span className="hero-section__proof-text">
                <strong>4.9/5</strong> từ 1.200+ phụ huynh
              </span>
            </div>

            {/* CTAs */}
            <div className="hero-section__ctas">
              <button className="btn btn-primary hero-section__cta-primary">
                <span>Sở hữu ngay</span>
                <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline" onClick={scrollToVideo}>
                <PlayCircle size={18} />
                <span>Xem video</span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="hero-section__trust">
              <span className="hero-section__trust-item">🌿 Gỗ tự nhiên an toàn</span>
              <span className="hero-section__trust-sep">·</span>
              <span className="hero-section__trust-item">📦 Miễn phí vận chuyển</span>
              <span className="hero-section__trust-sep">·</span>
              <span className="hero-section__trust-item">↩ Đổi trả 30 ngày</span>
            </div>
          </div>

          {/* ── RIGHT: Product Image ── */}
          <div ref={imageRef} className="hero-section__image-wrap scroll-reveal scale-in">
            <div className="hero-section__image-glow" />
            <div className="hero-section__image-frame">
              <img
                src={heroImage}
                alt="Trẻ em tương tác với puzzle gỗ Chạm Việt và AR"
                className="hero-section__img"
              />
              {/* Float badge: AR active */}
              <div className="hero-section__float-badge scroll-reveal fade-up delay-400">
                <div className="hero-section__float-icon">
                  <PlayCircle size={20} color="white" />
                </div>
                <div>
                  <p className="hero-section__float-label">Công nghệ</p>
                  <p className="hero-section__float-value">AR &amp; AI Tương tác</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY CTA (desktop) ── */}
      <div
        className="hero-sticky-cta"
        style={{
          transform: showStickyCtA ? 'translateY(0)' : 'translateY(120%)',
          opacity: showStickyCtA ? 1 : 0
        }}
      >
        <span className="hero-sticky-cta__label">Chạm Việt – Bộ phygital văn hóa</span>
        <button className="btn btn-primary hero-sticky-cta__btn">
          <span>Sở hữu ngay</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}
