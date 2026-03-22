import { Box } from '@mui/material';
import { PageSection, ContentContainer, StackWrapper, SectionHeader } from '../../common/layout';
import { FeatureCard } from '../../common/ui';

export interface HomeLearningSectionProps {
  copy: any;
}

export function HomeLearningSection({ copy }: HomeLearningSectionProps) {
  return (
    <PageSection id="products" isAltBackground>
      <ContentContainer>
        <StackWrapper spacing={6} alignItems="center">
          <SectionHeader
            title={copy.title}
            subtitle={copy.description}
            titleColor="secondary.dark"
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 3,
              width: '100%',
            }}
          >
            {copy.cards.map((card: any, index: number) => (
              <FeatureCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
                iconBackgroundColor={card.color}
              />
            ))}
          </Box>
        </StackWrapper>
      </ContentContainer>
    </PageSection>
  );
}
