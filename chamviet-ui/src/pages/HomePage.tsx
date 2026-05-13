import './HomePage.css';
import { useScroll, useSpring, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import Hero from '../components/features/home/Hero';
import VideoSection from '../components/features/home/VideoSection';
import CoreFunctions from '../components/features/home/CoreFunction';
import Unboxing from '../components/features/home/Unboxing';
import Workflow from '../components/features/home/Workflow';
import Testimonials from '../components/features/home/Testimonials';
import CulturalValue from '../components/features/home/CulturalValue';

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Scroll Progress Bar ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--primary)',
          zIndex: 200,
          originX: 0,
          scaleX
        }}
      />

      {/* ── Page Sections ── */}
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

        {/* 7. Brand Philosophy */}
        <CulturalValue />
      </main>

      {/* ── Mobile Sticky CTA ── */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        className="mobile-only"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '16px',
          right: '16px',
          zIndex: 40
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
    </div>
  );
}
