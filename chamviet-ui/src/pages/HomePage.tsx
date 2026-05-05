import { Box } from '@mui/material';
import { useHomePageData } from '../hooks/useHomePageData';
import { HomeHeroSection, HomeLearningSection, HomeStepsSection } from '../components/features/home';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import ScrollProgressBar from '../components/common/ScrollProgressBar';

export default function HomePage() {
  const { copy, images } = useHomePageData();

  const heroRef = useSmoothScroll<HTMLDivElement>({ threshold: 0.05 });
  const learningRef = useSmoothScroll<HTMLDivElement>();
  const stepsRef = useSmoothScroll<HTMLDivElement>();

  return (
    <Box>
      <ScrollProgressBar />
      <Box ref={heroRef} className="scroll-reveal fade-up fast">
        <HomeHeroSection copy={copy.hero} images={images} />
      </Box>
      <Box ref={learningRef} className="scroll-reveal fade-up">
        <HomeLearningSection copy={copy.learning} />
      </Box>
      <Box ref={stepsRef} className="scroll-reveal fade-up">
        <HomeStepsSection copy={copy.steps} images={images.howToPlay} />
      </Box>
    </Box>
  );
}