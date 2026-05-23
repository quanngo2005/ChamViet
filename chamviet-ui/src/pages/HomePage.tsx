import './HomePage.css';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import Hero from '../components/features/home/Hero';
import VideoSection from '../components/features/home/VideoSection';
import CoreFunctions from '../components/features/home/CoreFunction';
import Unboxing from '../components/features/home/Unboxing';
import Workflow from '../components/features/home/Workflow';
import Testimonials from '../components/features/home/Testimonials';
import CulturalValue from '../components/features/home/CulturalValue';
import PurchaseSection from '../components/features/home/PurchaseSection';
import NewsSection from '../components/features/home/NewsSection';

/** Mobile-only sticky CTA — shown at bottom on small screens */
function MobileStickyCtA() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, duration: 0.45 }}
      className="mobile-only"
      style={{
        position: 'fixed',
        bottom: '92px',
        left: '16px',
        right: '16px',
        zIndex: 40,
      }}
    >
      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '16px' }}
      >
        <span>Sở hữu ngay</span>
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="home-page">
      <main>
        {/* 1. Hero – above-fold product showcase */}
        <Hero />

        {/* 2. Video – show don't tell */}
        <VideoSection />

        {/* 3. Core Functions – 4-sense phygital */}
        <CoreFunctions />

        {/* 4. What's In The Box – flat-lay product reveal */}
        <Unboxing />

        {/* 5. Phygital Journey – 4-step with icons */}
        <Workflow />

        {/* 6. Social Proof – testimonials + trust badges */}
        <Testimonials />

        {/* 7. Purchase/Preorder */}
        <PurchaseSection />

        {/* 8. News */}
        <NewsSection />

        {/* 9. Brand Philosophy */}
        <CulturalValue />
      </main>

      <MobileStickyCtA />
    </div>
  );
}

