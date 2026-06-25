import './HowToPlayPage.css';

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Camera,
  CircleHelp,
  Lightbulb,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Volume2,
  Brain,
} from 'lucide-react';

import { HOME_IMAGES, HOME_PRODUCT } from '../data/home';
import Workflow from '../components/features/home/Workflow';

const parentTips = [
  {
    icon: ShieldCheck,
    title: 'Cùng con quan sát',
    description:
      'Hỏi bé nhìn thấy nhân vật nào, chi tiết nào khiến bé nhớ nhất.',
  },
  {
    icon: Lightbulb,
    title: 'Giữ ánh sáng vừa đủ',
    description:
      'Không gian hơi dịu sáng giúp phần phản chiếu rõ hơn, nhưng vẫn đủ sáng để bé thao tác với tranh',
  },
  {
    icon: Brain,
    title: 'Gợi mở thay vì kiểm tra',
    description:
      'Thay vì hỏi đúng-sai, hãy hỏi "Điều gì xảy ra tiếp theo?" hoặc "Nếu con ở đó con sẽ làm gì?"',
  },
  {
    icon: Sparkles,
    title: 'Kể lại bằng lời của bé',
    description:
      'Sau khi xem, để bé tự kể lại câu chuyện theo cách mình hiểu.',
  },
];

const commonIssues = [
  {
    icon: Camera,
    title: 'Ảnh chụp chưa nhận diện được',
    description:
      'Hãy đặt tranh trong khung hình rõ nét, đủ sáng và tránh nghiêng quá nhiều.',
  },
  {
    icon: Lightbulb,
    title: 'Hologram chưa nổi rõ',
    description:
      'Giảm bớt ánh sáng xung quanh nhưng không quá tối và đặt điện thoại đúng vị trí trên hộp chiếu.',
  },
  {
    icon: Volume2,
    title: 'Âm thanh nhỏ',
    description:
      'Tăng âm lượng điện thoại để cả nhà cùng nghe và tương tác hỏi đáp cùng AI',
  },
];

function HeroSection() {
  return (
    <section className="how-play-hero">
      <div className="how-play-hero__media" aria-hidden="true">
        <picture>
          <source srcSet={HOME_IMAGES.unboxingFlatlayWebp} type="image/webp" />
          <img src={HOME_IMAGES.heroChildAr} alt="" decoding="async" fetchPriority="high" />
        </picture>
      </div>
      <div className="how-play-hero__wash" />

      <div className="container how-play-hero__inner">
        <motion.div
          className="how-play-hero__copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1>4 bước để truyền thuyết Việt sống dậy trong căn nhà của bạn </h1>
          <p>
            Từ ghép tranh, quét hình đến xem hologram và hỏi đáp cùng AI Chíp Bông - tất cả chỉ cần một chiếc điện thoại và hộp chiếu đi kèm.
          </p>

          <div className="how-play-hero__proofs" aria-label="Các phần trong trải nghiệm">
            <span>Mở hộp</span>
            <span>Ghép tranh</span>
            <span>Quét tranh</span>
            <span>Hỏi tiếp sau khi xem</span>
          </div>

          <div className="how-play-hero__ctas">
            <Link to="/scan" className="btn btn-outline">
              <ScanLine size={18} />
              <span>Bắt đầu ngay</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



function TipsForParentsSection() {
  return (
    <section className="how-play-guidance">
      <div className="container how-play-guidance__inner">
        <div className="how-play-guidance__copy">
          <h2>Hãy biến mỗi câu chuyện thành một cuộc trò chuyện nhỏ trong gia đình.</h2>
          <p>
            Không có cách nào tốt hơn việc cùng con chơi và trò chuyện. Khi đã biết cách bắt đầu, việc cùng con
            hỏi đáp và trao đổi sau mỗi buổi học sẽ giúp con ghi nhớ lâu hơn.
          </p>
        </div>

        <div className="how-play-guidance__list">
          {parentTips.map((tip) => {
            const Icon = tip.icon;

            return (
              <article key={tip.title} className="how-play-info-row">
                <span className="how-play-info-row__icon" aria-hidden="true">
                  <Icon size={21} />
                </span>
                <div>
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CommonIssuesSection() {
  return (
    <section className="how-play-issues">
      <div className="container">
        <div className="how-play-section-head how-play-section-head--left">
          <h2>Mẹo nhỏ để trải nghiệm mượt hơn</h2>
        </div>

        <div className="how-play-issue-grid">
          {commonIssues.map((issue) => {
            const Icon = issue.icon;

            return (
              <article key={issue.title} className="how-play-issue-card">
                <span className="how-play-issue-card__icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <h3>{issue.title}</h3>
                <p>{issue.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="how-play-final">
      <div className="container">
        <div className="how-play-final__card">
          <h2>Sẵn sàng để bé tự tay đánh thức câu chuyện Việt đầu tiên?</h2>
          <p>
            Chỉ với vài bước đơn giản, cả gia đình đã có thể cùng ghép tranh, xem video 3D hologram và trò chuyện về những truyền thuyết văn hóa Việt.
          </p>
          <div className="how-play-final__ctas">
            <Link to={`/products/${HOME_PRODUCT.id}`} className="btn btn-primary">
              <span>{HOME_PRODUCT.ctaLabel}</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/story" className="btn btn-outline">
              <CircleHelp size={18} />
              <span>Xem câu chuyện mẫu</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HowToPlayPage() {
  return (
    <main className="how-play-page">
      <HeroSection />
      <Workflow />
      <TipsForParentsSection />
      <CommonIssuesSection />
      <FinalCtaSection />
    </main>
  );
}
