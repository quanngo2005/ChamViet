import './HowToPlayPage.css';

import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Boxes,
  Camera,
  CircleHelp,
  Lightbulb,
  MessageCircleQuestion,
  PlayCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Volume2,
  type LucideIcon,
} from 'lucide-react';

import { HOME_COPY, HOME_IMAGES, HOME_PRODUCT } from '../data/home';

const workflowIcons: Record<string, LucideIcon> = {
  puzzle: Boxes,
  scanner: ScanLine,
  ghost: PlayCircle,
  qa: MessageCircleQuestion,
};

const parentTips = [
  {
    icon: ShieldCheck,
    title: 'Cùng con đi từng bước',
    description:
      'Hãy để bé tự lắp và tự quét trước, sau đó ba mẹ gợi mở thêm bằng câu hỏi về nhân vật, hành động và bài học trong chuyện.',
  },
  {
    icon: Lightbulb,
    title: 'Giữ ánh sáng vừa đủ',
    description:
      'Không gian hơi dịu sáng giúp phần phản chiếu rõ hơn, nhưng vẫn đủ sáng để bé thao tác với tranh và điện thoại an toàn.',
  },
  {
    icon: Sparkles,
    title: 'Kể lại sau khi xem',
    description:
      'Khi video kết thúc, thử để bé dùng tranh gỗ kể lại câu chuyện theo cách riêng rồi hỏi AI những chi tiết bé tò mò.',
  },
];

const commonIssues = [
  {
    icon: Camera,
    title: 'Camera chưa nhận tranh',
    description:
      'Đặt tranh trên mặt phẳng sáng, đưa trọn bức tranh vào khung quét và giữ điện thoại ổn định vài giây.',
  },
  {
    icon: Lightbulb,
    title: 'Phản chiếu bị mờ',
    description:
      'Giảm ánh sáng xung quanh, tăng độ sáng màn hình và đặt điện thoại đúng vị trí trên hộp Pepper\'s Ghost.',
  },
  {
    icon: Volume2,
    title: 'Âm thanh quá nhỏ',
    description:
      'Bật âm lượng điện thoại trước khi đặt lên hộp, hoặc dùng loa ngoài khi bé xem cùng cả gia đình.',
  },
];

function HeroSection() {
  return (
    <section className="how-play-hero">
      <div className="how-play-hero__media" aria-hidden="true">
        <picture>
          <source srcSet={HOME_IMAGES.heroChildArWebp} type="image/webp" />
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
          <p className="section-eyebrow">Hành trình trải nghiệm</p>
          <h1>Cách chơi Chạm Việt trong một buổi tối</h1>
          <p>
            Từ lúc mở hộp đến khi bé hỏi AI về câu chuyện, mọi thứ được thiết kế thành
            một mạch chơi dễ làm tại nhà: lắp tranh, quét tranh, xem sân khấu nhỏ rồi
            cùng nhau kể lại.
          </p>

          <div className="how-play-hero__proofs" aria-label="Các phần trong trải nghiệm">
            <span>Tranh gỗ</span>
            <span>AI Vision</span>
            <span>Pepper&apos;s Ghost</span>
            <span>Hỏi đáp AI</span>
          </div>

          <div className="how-play-hero__ctas">
            <Link to={`/products/${HOME_PRODUCT.id}`} className="btn btn-primary">
              <span>{HOME_PRODUCT.ctaLabel}</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/scan" className="btn btn-outline">
              <ScanLine size={18} />
              <span>Thử quét tranh</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="how-play-steps">
      <div className="container">
        <div className="how-play-section-head">
          <p className="section-eyebrow">Hành trình 4 bước</p>
          <h2>{HOME_COPY.steps.title}</h2>
          <p>{HOME_COPY.steps.description}</p>
        </div>

        <div className="how-play-step-grid">
          {HOME_COPY.steps.items.map((step) => {
            const Icon = workflowIcons[step.variant] ?? Sparkles;

            return (
              <article
                key={step.number}
                className={`how-play-step-card how-play-step-card--${step.variant}`}
                style={{ '--accent-color': step.accentColor } as CSSProperties}
              >
                <div className="how-play-step-card__media">
                  <picture>
                    <img src={step.image} alt={step.alt} loading="lazy" decoding="async" />
                  </picture>
                  <div className="how-play-step-card__veil" aria-hidden="true" />
                  <span className="how-play-step-card__badge">{step.screenLabel}</span>
                </div>

                <div className="how-play-step-card__body">
                  <div className="how-play-step-card__meta">
                    <span className="how-play-step-card__icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <span className="how-play-step-card__num">
                      {String(step.number).padStart(2, '0')}
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TipsForParentsSection() {
  return (
    <section className="how-play-guidance">
      <div className="container how-play-guidance__inner">
        <div className="how-play-guidance__copy">
          <p className="section-eyebrow">Dành cho phụ huynh</p>
          <h2>Biến phần chơi thành một cuộc trò chuyện</h2>
          <p>
            Chạm Việt không chỉ là xem video. Phần hay nhất thường đến sau đó, khi bé
            tự nói lại điều mình nhớ và đặt thêm câu hỏi về văn hóa Việt.
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
          <p className="section-eyebrow">Tối ưu trải nghiệm</p>
          <h2>Lỗi thường gặp khi chơi</h2>
          <p>Một vài chỉnh sửa nhỏ giúp phần quét tranh và phản chiếu ổn định hơn trên điện thoại.</p>
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
          <p className="section-eyebrow">Sẵn sàng mở hộp?</p>
          <h2>Bắt đầu với Hồ Gươm và Thánh Gióng trong một box</h2>
          <p>
            Mỗi bộ có đủ tranh, hộp phản chiếu và mạch trải nghiệm để cả nhà cùng đi
            qua câu chuyện đầu tiên.
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
      <StepsSection />
      <TipsForParentsSection />
      <CommonIssuesSection />
      <FinalCtaSection />
    </main>
  );
}
