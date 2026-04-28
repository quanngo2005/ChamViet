import { useEffect, useRef, type ReactNode } from 'react';
import { Box } from '@mui/material';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import HomeHeroSection from '../components/features/home/HomeHeroSection';
import CoreFunctions from '../components/features/home/CoreFunction';
import Unboxing from '../components/features/home/Unboxing';
import HomeStepsSection from '../components/features/home/HomeStepsSection';
import CulturalValue from '../components/features/home/CulturalValue';
import './HomePage.css';

type ParallaxSectionProps = {
  children: ReactNode;
  offset?: number;
};

function ParallaxSection({ children, offset = 32 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [offset, -offset]);

  return (
    <div ref={ref} className="home-page__section-shell">
      <motion.div className="home-page__section-parallax" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    document.documentElement.classList.add('home-page-active');
    document.body.classList.add('home-page-active');

    return () => {
      document.documentElement.classList.remove('home-page-active');
      document.body.classList.remove('home-page-active');
    };
  }, []);

  return (
    <Box className="home-page" sx={{ position: 'relative' }}>
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'var(--primary)', // Heritage Primary
          zIndex: 200,
          originX: 0,
          scaleX
        }}
      />

      <div className="home-page__glow home-page__glow--top" aria-hidden="true" />
      <div className="home-page__glow home-page__glow--middle" aria-hidden="true" />
      <div className="home-page__grain" aria-hidden="true" />

      <ParallaxSection offset={18}>
        <HomeHeroSection />
      </ParallaxSection>
      <ParallaxSection offset={26}>
        <CoreFunctions />
      </ParallaxSection>
      <ParallaxSection offset={34}>
        <Unboxing />
      </ParallaxSection>
      <ParallaxSection offset={28}>
        <HomeStepsSection />
      </ParallaxSection>
      <ParallaxSection offset={22}>
        <CulturalValue />
      </ParallaxSection>

      {/* Sticky Bottom CTA for Mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40
        }}
        className="mobile-only"
      >
        <button style={{
          background: 'var(--primary)',
          color: 'white',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
          MUA
        </button>
      </motion.div>
    </Box>
  );
}
