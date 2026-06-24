import './HomePage.css';
import { lazy, Suspense, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Boxes, Hand, MessageCircleQuestion, PlayCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
const fullBox = "https://storage.googleapis.com/chamviet-media-bucket-2026/fullbox.webp";

import Hero from '../components/features/home/Hero';
import { HOME_COPY, HOME_PRODUCT } from '../data/home';

const VideoSection = lazy(() => import('../components/features/home/VideoSection'));
const Workflow = lazy(() => import('../components/features/home/Workflow'));
const Testimonials = lazy(() => import('../components/features/home/Testimonials'));
const PurchaseSection = lazy(() => import('../components/features/home/PurchaseSection'));

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
        <span className="mobile-sticky-cta__label">{HOME_PRODUCT.ctaLabel}</span>
        <ArrowRight size={18} />
      </Link>
    </motion.div>
  );
}

const benefitIcons = {
  hands: Hand,
  stage: PlayCircle,
  qa: MessageCircleQuestion,
  gift: Sparkles,
};

function ExperienceBento() {
  const benefits = HOME_COPY.learning.cards;

  return (
    <section className="experience-bento" aria-label=" Điều khiến Chạm Việt khác biệt">
      <div className="container">
        <div className="experience-bento__heading">

          <h2 style={{ color: 'var(--primary)' }}>{HOME_COPY.learning.title}</h2>
          <p>{HOME_COPY.learning.description}</p>
        </div>

        <div className="experience-bento__grid">
          <Link to={`/products/${HOME_PRODUCT.id}`} className="experience-bento__card experience-bento__card--product">
            <picture>
              <source srcSet={fullBox} type="image/webp" />
              <img
                src={fullBox}
                alt="Bộ tranh gỗ và hộp Chạm\u00A0Việt"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className="experience-bento__feature-copy">
              <span className="experience-bento__icon">
                <Boxes size={22} />
              </span>
              <div>
                <h3>2 tranh trong 1 hộp</h3>
                <p>Hồ Gươm và Thánh Gióng được đóng gói thành một mạch chơi rõ ràng: lắp, quét, xem, hỏi. Đi kèm hộp phản chiếu 3D</p>
              </div>
            </div>
          </Link>

          {benefits.map((benefit) => {
            const Icon = benefitIcons[benefit.icon as keyof typeof benefitIcons] ?? Sparkles;
            return (
              <article
                key={benefit.title}
                className="experience-bento__card experience-bento__card--benefit"
                style={{ '--benefit-bg': benefit.color } as CSSProperties}
              >
                <span className="experience-bento__icon">
                  <Icon size={22} />
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            );
          })}
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
        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <Workflow />
          <VideoSection />
          <Testimonials />
          <PurchaseSection />
        </Suspense>
      </main>

      <MobileStickyCtA />
    </div>
  );
}
