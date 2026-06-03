import './HomePage.css';
import { motion } from 'motion/react';
import { ArrowRight, Boxes, MessageCircleQuestion, PlayCircle, ScanLine, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import Hero from '../components/features/home/Hero';
import VideoSection from '../components/features/home/VideoSection';
import Workflow from '../components/features/home/Workflow';
import Testimonials from '../components/features/home/Testimonials';
import PurchaseSection from '../components/features/home/PurchaseSection';
import { HOME_IMAGES, HOME_PRODUCT } from '../data/home';

function MobileStickyCtA() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, duration: 0.45 }}
      className="mobile-only mobile-sticky-cta"
    >
      <Link
        to={`/products/${HOME_PRODUCT.id}`}
        className="btn btn-primary mobile-sticky-cta__button"
      >
        <span>{HOME_PRODUCT.ctaLabel}</span>
        <ArrowRight size={18} />
      </Link>
    </motion.div>
  );
}

function ExperienceBento() {
  return (
    <section className="experience-bento" aria-label="Trải nghiệm Chạm Việt">
      <div className="container">
        <div className="experience-bento__heading">
          <p className="experience-bento__kicker">Chơi bằng tay, mở chuyện bằng ánh sáng</p>
          <h2>
            Một chiếc hộp biến tranh gỗ thành
            <span
              className="experience-bento__inline-image"
              style={{ backgroundImage: `url(${HOME_IMAGES.videoThumbnail})` }}
              aria-hidden="true"
            />
            sân khấu văn hóa nhỏ.
          </h2>
        </div>

        <div className="experience-bento__grid">
          <Link to={`/products/${HOME_PRODUCT.id}`} className="experience-bento__card experience-bento__card--product">
            <span className="experience-bento__icon">
              <Boxes size={22} />
            </span>
            <div>
              <h3>2 tranh trong 1 box</h3>
              <p>Hồ Gươm và Thánh Gióng được đóng gói thành một mạch chơi rõ ràng: lắp, quét, xem, hỏi.</p>
            </div>
            <img src={HOME_IMAGES.heroImage} alt="Bộ tranh gỗ Chạm Việt" />
          </Link>

          <Link to="/story" className="experience-bento__card experience-bento__card--cinema">
            <img src={HOME_IMAGES.videoThumbnail} alt="Câu chuyện hiện lên trong hộp phản chiếu" />
            <div>
              <h3>Pepper's Ghost dễ hiểu</h3>
              <p>Phụ huynh nhìn vào là hiểu ngay vì sao điện thoại, hộp kính và tranh gỗ đi cùng nhau.</p>
            </div>
            <span className="experience-bento__icon">
              <PlayCircle size={22} />
            </span>
          </Link>

          <Link to="/scan" className="experience-bento__card experience-bento__card--scan">
            <span className="experience-bento__icon">
              <ScanLine size={22} />
            </span>
            <h3>Quét tranh để mở truyện</h3>
            <p>Luồng nhận diện trở thành một bước chơi, không phải một thao tác kỹ thuật khô khan.</p>
          </Link>

          <div className="experience-bento__card experience-bento__card--qa">
            <span className="experience-bento__icon">
              <MessageCircleQuestion size={22} />
            </span>
            <h3>Hỏi tiếp sau khi xem</h3>
            <p>AI giúp biến đoạn video thành cuộc trò chuyện giữa trẻ và phụ huynh.</p>
          </div>

          <div className="experience-bento__card experience-bento__card--proof">
            <span className="experience-bento__icon">
              <Sparkles size={22} />
            </span>
            <h3>Tập trung vào kết quả</h3>
            <p>Con tự tay hoàn thành tranh, xem câu chuyện và kể lại ý chính theo cách tự nhiên hơn.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="home-page">
      <main className="home-page__main">
        <Hero />
        <ExperienceBento />
        <VideoSection />
        <Workflow />
        <PurchaseSection />
        <Testimonials />
      </main>

      <MobileStickyCtA />
    </div>
  );
}
