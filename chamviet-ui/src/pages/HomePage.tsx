import { Box } from '@mui/material';
import { useHomePageData } from '../hooks/useHomePageData';
import { HomeHeroSection, HomeLearningSection, HomeStepsSection } from '../components/features/home';

export default function HomePage() {
  const { copy, images } = useHomePageData();

  return (
    <Box>
      <HomeHeroSection copy={copy.hero} images={images} />
      <HomeLearningSection copy={copy.learning} />
      <HomeStepsSection copy={copy.steps} images={images.howToPlay} />
    </Box>
  );
}