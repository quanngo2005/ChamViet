import { Box } from '@mui/material';
import { PageSection, ContentContainer, StackWrapper, SectionHeader } from '../../common/layout';
import { FeatureCard } from '../../common/ui';
import { useSmoothScroll, useSmoothScrollStagger } from '../../../hooks/useSmoothScroll';

export interface HomeLearningSectionProps {
  copy: any;
}

export function HomeLearningSection({ copy }: HomeLearningSectionProps) {
  const headerRef = useSmoothScroll<HTMLDivElement>();
  const gridRef = useSmoothScrollStagger<HTMLDivElement>('.feature-card-item', 120);

  return (
    <PageSection id="products" isAltBackground>
      <ContentContainer>
        <StackWrapper spacing={6} alignItems="center">
          <Box ref={headerRef} className="scroll-reveal fade-up">
            <SectionHeader
              title={copy.title}
              subtitle={copy.description}
              titleColor="secondary.dark"
            />
          </Box>

          <Box
            ref={gridRef}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 3,
              width: '100%',
            }}
          >
            {copy.cards.map((card: any, index: number) => (
              <Box key={index} className="feature-card-item scroll-reveal-child fade-up">
                <FeatureCard
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  iconBackgroundColor={card.color}
                />
              </Box>
            ))}
          </Box>
        </StackWrapper>
      </ContentContainer>
    </PageSection>
  );
}
