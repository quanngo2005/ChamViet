import { motion, useTransform } from "motion/react";

import { useAppScroll } from "../../hooks/useAppScroll";

/**
 * A thin gradient progress bar fixed to the top of the viewport
 * that fills as the user scrolls down the page.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useAppScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="app-scroll-progress"
      style={{
        opacity,
        scaleX: scrollYProgress,
      }}
    />
  );
}
