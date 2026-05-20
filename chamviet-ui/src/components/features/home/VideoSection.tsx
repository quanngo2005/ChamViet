import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';
import videoThumbnail from '../../../assets/video-thumbnail.png';

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const sectionRef = useSmoothScroll<HTMLDivElement>();

  return (
    <section id="video-section" className="video-section">
      <div className="container">
        <div
          ref={sectionRef}
          className="scroll-reveal fade-up video-section__inner"
        >
          {/* Header */}
          <div className="video-section__header">
            <p className="video-section__eyebrow">Trải nghiệm thực tế</p>
            <h2 className="video-section__title">
              Xem câu chuyện hiện lên<br />
              <span style={{ color: 'var(--primary)' }}>trong hộp Pepper's Ghost</span>
            </h2>
            <p className="video-section__sub">
              Sự kết hợp giữa video trên điện thoại và hộp phản chiếu tạo cảm giác như một sân khấu thu nhỏ.
            </p>
          </div>

          {/* Thumbnail / Player */}
          <div
            className="video-section__player"
            onClick={() => setPlaying(true)}
            role="button"
            aria-label="Phát video giới thiệu Chạm Việt"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setPlaying(true)}
          >
            {!playing ? (
              <>
                <img
                  src={videoThumbnail}
                  alt="Xem trải nghiệm video trong hộp phản chiếu"
                  className="video-section__thumb"
                />
                {/* Overlay */}
                <div className="video-section__overlay">
                  <div className="video-section__play-btn">
                    <PlayCircle size={56} color="white" />
                  </div>
                  <p className="video-section__play-label">Xem trải nghiệm</p>
                </div>
                {/* Duration badge */}
                <span className="video-section__duration">2:34</span>
              </>
            ) : (
              <div className="video-section__embed">
                {/* Replace with actual video embed when available */}
                <iframe
                  title="Chạm Việt – Phygital Experience"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 0 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
