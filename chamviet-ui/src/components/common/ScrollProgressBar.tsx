import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

/**
 * A thin gradient progress bar fixed to the top of the viewport
 * that fills as the user scrolls down the page.
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(scrolled, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #a83232, #d9a441, #a83232)',
        backgroundSize: '200% 100%',
        transformOrigin: 'left',
        transform: `scaleX(${progress})`,
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'transform 0.15s linear',
        opacity: progress > 0.01 ? 1 : 0,
      }}
    />
  );
}
