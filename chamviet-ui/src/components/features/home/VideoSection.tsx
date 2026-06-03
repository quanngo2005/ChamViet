import { PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';
import videoThumbnail from '../../../assets/video-thumbnail.png';

export default function VideoSection() {
  const sectionRef = useSmoothScroll<HTMLDivElement>();
  const navigate = useNavigate();
  const openStory = () => navigate('/story');

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
            onClick={openStory}
            role="button"
            aria-label="Mở trang câu chuyện Chạm Việt"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openStory()}
          >
            <img
              src={videoThumbnail}
              alt="Xem trải nghiệm video trong hộp phản chiếu"
              className="video-section__thumb"
            />
            <div className="video-section__overlay">
              <div className="video-section__play-btn">
                <PlayCircle size={56} color="white" />
              </div>
              <p className="video-section__play-label">Mở câu chuyện</p>
            </div>
            <span className="video-section__duration">Trải nghiệm</span>
          </div>
        </div>
      </div>
    </section>
  );
}
