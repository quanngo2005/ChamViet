import { Box } from '@mui/material';
import { PageSection, ContentContainer, StackWrapper, SectionHeader } from '../../common/layout';
import { StepCard } from '../../common/ui';

export interface HomeStepsSectionProps {
  copy: any;
  images: any;
}

export function HomeStepsSection({ copy, images }: HomeStepsSectionProps) {
  return (
    <PageSection id="how-to-play" sx={{ backgroundColor: 'grey.100' }}>
      <ContentContainer>
        <StackWrapper spacing={8}>
          <SectionHeader
            title={copy.title}
            subtitle={copy.description}
            titleColor="secondary.dark"
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 4,
              width: '100%',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '40px',
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: 'rgba(122, 82, 48, 0.1)',
                pointerEvents: 'none',
              }}
            />
            {copy.items.map((step: any, index: number) => {
              const stepImageKey = `step${index + 1}`;
              return (
                <StepCard
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  image={images[stepImageKey]}
                  accentColor="primary.main"
                />
              );
            })}
          </Box>
        </StackWrapper>
      </ContentContainer>
    </PageSection>
  );
}
