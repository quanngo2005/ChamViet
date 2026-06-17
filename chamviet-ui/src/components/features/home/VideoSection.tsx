import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Reveal } from "../../common/MotionReveal";
import videoThumbnail from "../../../assets/video-thumbnail.png";
import videoThumbnailWebp from "../../../assets/video-thumbnail.webp";

export default function VideoSection() {
  const navigate = useNavigate();
  const openStory = () => navigate("/story");

  return (
    <section id="video-section" className="video-section">
      <div className="container">
        <Reveal className="video-section__inner">
          {/* Header */}
          <div className="video-section__header">

            <h2 className="video-section__title">
              <span>Biến một bức tranh thành cả một sân khấu 3D</span>
            </h2>
            <p className="video-section__sub">
              Từ những mảnh ghép trên tay đến một câu chuyện sống động ngay trước mắt.
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
            <picture>
              <source srcSet={videoThumbnailWebp} type="image/webp" />
              <img
                src={videoThumbnail}
                alt="Xem trải nghiệm video trong hộp phản chiếu"
                className="video-section__thumb"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className="video-section__overlay">
              <div className="video-section__play-btn">
                <PlayCircle size={56} color="white" />
              </div>
              <p className="video-section__play-label">Mở câu chuyện</p>
            </div>
            <span className="video-section__duration">Trải nghiệm</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
